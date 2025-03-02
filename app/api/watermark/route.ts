import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import ffmpeg from "fluent-ffmpeg";
import { promises as fs } from "fs";
import path from "path";
import { verifyToken } from "@/lib/auth";

// Helper function to get video duration with fallback
async function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.warn("FFprobe failed:", err.message);
        resolve(10); // Fallback duration (10 seconds)
      } else {
        resolve(metadata.format.duration || 10);
      }
    });
  });
}

export async function POST(request: NextRequest) {
  try {
    const { postId, mediaUrl, mediaType, username } = await request.json();
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!postId || !mediaUrl || !mediaType || !username || !token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tempDir = path.join(process.cwd(), "tmp");
    await fs.mkdir(tempDir, { recursive: true });
    const inputPath = path.join(
      tempDir,
      `input-${postId}.${mediaType === "image" ? "jpg" : "mp4"}`
    );
    const outputPath = path.join(
      tempDir,
      `output-${postId}.${mediaType === "image" ? "jpg" : "mp4"}`
    );
    const watermarkPath = path.join(process.cwd(), "public", "watermark.png");

    const mediaResponse = await fetch(mediaUrl);
    if (!mediaResponse.ok) throw new Error("Failed to fetch media");
    const mediaBuffer = Buffer.from(await mediaResponse.arrayBuffer());
    await fs.writeFile(inputPath, mediaBuffer);

    const WATERMARK_WIDTH = 240;
    const WATERMARK_HEIGHT = 930;
    const USERNAME_HEIGHT = WATERMARK_HEIGHT - 940;
    const USERNAME_WIDTH = WATERMARK_WIDTH - 200;
    const TEXT_HEIGHT = 30;
    const PADDING = 20;
    const GAP = 5;

    if (mediaType === "image") {
      const metadata = await sharp(inputPath).metadata();
      const imageWidth = metadata.width || 0;
      const imageHeight = metadata.height || 0;

      const resizedWatermark = await sharp(watermarkPath)
        .resize({
          width: WATERMARK_WIDTH,
          height: WATERMARK_HEIGHT,
          fit: "contain",
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer();

      const topLeftWatermarkTop = PADDING;
      const topLeftWatermarkLeft = PADDING;
      const topLeftTextTop = topLeftWatermarkTop + WATERMARK_HEIGHT + GAP;
      const topLeftTextLeft = topLeftWatermarkLeft;

      const bottomRightWatermarkTop =
        imageHeight - WATERMARK_HEIGHT - TEXT_HEIGHT - GAP - PADDING;
      const bottomRightWatermarkLeft = imageWidth - WATERMARK_WIDTH - PADDING;
      const bottomRightTextTop =
        bottomRightWatermarkTop + WATERMARK_HEIGHT + GAP;
      const bottomRightTextLeft = bottomRightWatermarkLeft;

      await sharp(inputPath)
        .composite([
          {
            input: resizedWatermark,
            top: topLeftWatermarkTop,
            left: topLeftWatermarkLeft,
            blend: "over",
          },
          {
            input: Buffer.from(
              `<svg width="${WATERMARK_WIDTH}" height="${TEXT_HEIGHT}">
                <text x="0" y="25" font-size="25" fill="rgba(255,255,255,0.7)">@${username}</text>
              </svg>`
            ),
            top: topLeftTextTop,
            left: topLeftTextLeft,
            blend: "over",
          },
          {
            input: resizedWatermark,
            top: bottomRightWatermarkTop,
            left: bottomRightWatermarkLeft,
            blend: "over",
          },
          {
            input: Buffer.from(
              `<svg width="${WATERMARK_WIDTH}" height="${TEXT_HEIGHT}">
                <text x="0" y="25" font-size="25" fill="rgba(255,255,255,0.7)">@${username}</text>
              </svg>`
            ),
            top: bottomRightTextTop,
            left: bottomRightTextLeft,
            blend: "over",
          },
        ])
        .toFile(outputPath);
    } else if (mediaType === "video") {
      const resizedWatermarkPath = path.join(
        tempDir,
        `watermark-${postId}.png`
      );
      await sharp(watermarkPath)
        .resize({
          width: WATERMARK_WIDTH,
          height: WATERMARK_HEIGHT,
          fit: "contain",
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toFile(resizedWatermarkPath);

      const hasWatermarkImage = await fs
        .access(resizedWatermarkPath)
        .then(() => true)
        .catch(() => false);

      if (!hasWatermarkImage) {
        throw new Error(`Watermark image not found at ${resizedWatermarkPath}`);
      }

      const duration = await getVideoDuration(inputPath);
      console.log(`Video duration: ${duration} seconds`);

      await new Promise((resolve, reject) => {
        const proc = ffmpeg(inputPath); // Define proc here

        proc
          .input(resizedWatermarkPath) // Explicitly chain methods on proc
          .complexFilter([
            `[0:v][1:v]overlay=x='w-${WATERMARK_WIDTH}-${PADDING}':y='0.75*h-${
              WATERMARK_HEIGHT / 2
            }'[v_with_watermark]`,
            // Username text position: Below the watermark
            `[v_with_watermark]drawtext=text='@${username}':fontfile='/assets/fonts/manrope/Manrope-Bold.ttf':fontcolor=white:fontsize=18:y='0.75*h-${
              USERNAME_HEIGHT / 2
            }':x='${USERNAME_WIDTH}-${PADDING}'[outv]`,
          ])
          .outputOptions("-map [outv]")
          .outputOptions("-map 0:a?")
          .outputOptions("-c:v libx264")
          .outputOptions("-preset fast")
          .on("start", (commandLine) => {
            console.log("FFmpeg command:", commandLine);
          })
          .on("progress", (progress) => {
            console.log("Processing:", progress);
          })
          .on("end", async () => {
            console.log("Video processing completed");
            await fs.unlink(resizedWatermarkPath);
            resolve(null);
          })
          .on("error", (err, stdout, stderr) => {
            console.error("FFmpeg error:", err.message);
            console.error("FFmpeg stdout:", stdout);
            console.error("FFmpeg stderr:", stderr);
            reject(err);
          })
          .output(outputPath)
          .run();
      });
    } else {
      throw new Error("Unsupported media type");
    }

    const fileBuffer = await fs.readFile(outputPath);

    await fs.unlink(inputPath);
    await fs.unlink(outputPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mediaType === "image" ? "image/jpeg" : "video/mp4",
        "Content-Disposition": `attachment; filename="post-${postId}.${
          mediaType === "image" ? "jpg" : "mp4"
        }"`,
      },
    });
  } catch (error: any) {
    console.error("Watermark API error:", error.message);
    return NextResponse.json(
      { error: "Failed to process watermark: " + error.message },
      { status: 500 }
    );
  }
}
