"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Clipboard, GripVertical, PenBox, Plus, Trash, Video } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/Input";
import { UploadInput } from "@/components/Input/UploadInput";
import { addModuleService } from "@/services/module.service";
import { useMutation } from "@tanstack/react-query";
import { updatCreateModuleForm } from "@/redux/slices/module.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.hook";
import { CreateModuleForm } from "@/types";
import { useCreateModuleFormValidator } from "@/helpers/validators/useCreateModule.validator";
import { useRouter, useSearchParams } from "next/navigation";
import { generalHelpers } from "@/helpers";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Curriculum = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [modules, setModules] = useState<
    { id: string; name: string; slug: string; content?: any }[]
  >([]);
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [selectedModule, setSelectedModule] = useState<{
    id: string;
    name: string;
    slug: string;
    content?: any[];
  }>({ id: "", slug: "", name: "", content: [] });
  const [newModule, setNewModule] = useState("")
  const [files, setFiles] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const currentModule = searchParams.get("module");
  const updateCreateModule = (payload: Partial<CreateModuleForm>) =>
    dispatch(updatCreateModuleForm(payload));
  const { createModuleForm: createModuleStateValues } = useAppSelector(
    (store) => store.moduleStore
  );
  const { validate, errors, validateField } = useCreateModuleFormValidator({
    store: createModuleStateValues,
  });

  const { mutate: handleAddModule, isPending: isAddingModule } = useMutation({
    mutationFn: (payload: CreateModuleForm) => addModuleService(payload),
    onSuccess: async (data) => { },
    onError: (error: any) => { },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    validate(() => { });
  };

  const handleClickModule = (module: {
    id: string;
    name: string;
    slug: string;
    content?: any;
  }) => {
    setShowCreateModule(false);
    router.push(`?module=${generalHelpers.convertToSlug(module?.name)}`);
    setSelectedModule(module);
  };

  useEffect(() => {
    setModules([
      {
        id: "1",
        name: "Introductory Video",
        slug: "introductory-video",
        content: [
          {
            id: 1,
            title: "Introduction to programming",
          },
          {
            id: 2,
            title: "How does the browser works",
          },
        ],
      },
      {
        id: "2",
        name: "What is Javascript",
        content: [],
        slug: "what-is-javascript",
      },
    ]);
  }, []);

  useEffect(() => {
    router.push(`?module=introductory-video`);
    setSelectedModule({
      id: "1",
      name: "Introductory Video",
      slug: "introductory-video",
      content: [
        {
          id: 1,
          title: "Introduction to programming",
        },
        {
          id: 2,
          title: "How does the browser works",
        },
      ],
    })
  }, [router])

  return (
    <div className="flex gap-4 w-full">
      <Card className="basis-4/12 border-none px-1">
        <CardHeader>
          <CardTitle></CardTitle>
          <CardContent className="px-0 min-h-[58vh]">
            <aside className="h-full">
              {modules.length === 0 ? (
                <div className="h-full text-sm mb-4 flex flex-col justify-center items-center mt-28">
                  <Clipboard />
                  <p className="text-xl font-regular mt-4 font-semibold">
                    Create module
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {modules.map((module, index) => {
                    const isActive = currentModule === module?.slug;
                    return (
                      <div
                        onClick={() => handleClickModule(module)}
                        key={module.id}
                        className={`w-full flex items-center border cursor-pointer rounded-sm 
                        ${isActive ? "border-primary-400" : "border-primary-100"
                          }`}
                      >
                        <div className="p-3 flex items-center gap-2 text-left text-sm">
                          <GripVertical />
                          Module {index + 1}:
                        </div>
                        <div>
                          <p className="text-sm">{module.name}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </aside>
          </CardContent>
          <CardFooter className="px-0 py-0 border-t">
            <Button
              variant={"outline"}
              onClick={() => setShowCreateModule(true)}
              className="w-full mt-2"
            >
              <Plus size={16} /> Add New Module
            </Button>

          </CardFooter>
        </CardHeader>
      </Card>

      {/* Main Content Area */}
      <Card className="flex-1 border-none px-0 py-0">
        <CardHeader>
          <CardTitle></CardTitle>
          <CardContent className="px-0 py-0">
            {showCreateModule ? (
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <Input
                      variant="text"
                      label="Title"
                      maxLength={54}
                      placeholder="Enter module title"
                      value={createModuleStateValues.moduleTitle}
                      onChange={(e) => {
                        updateCreateModule({ moduleTitle: e.target.value });
                        validateField("moduleTitle", e.target.value);
                      }}
                      errorMessage={errors.moduleTitle}
                    />
                  </div>

                  <div className="mt-8">
                    <Button
                      type="submit"
                      className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
                    >
                      {isAddingModule ? <Spinner /> : "Continue"}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value="item-1"
                    className={`w-full cursor-pointer rounded-md mb-4 border-none`}
                  >
                    <div className="flex items-center w-full">
                      <div className="basis-[5%]">
                        <GripVertical />
                      </div>
                      <div className="flex-1">
                        <AccordionTrigger className="px-4 border w-full rounded-sm text-sm">
                          <p className="flex items-center gap-2">{selectedModule.name} <PenBox size={16} /></p>
                        </AccordionTrigger>
                      </div>
                      <div className="basis-[5%] ml-1">
                        <Trash />
                      </div>
                    </div>
                    <AccordionContent className="px-10 mt-5 w-full mx-auto">
                      {
                        selectedModule?.content?.length === 0 && <div className="w-full mx-auto flex flex-col items-center mt-6">
                          <Video size={30} />
                          <p className="text-lg">Add content to your module</p>
                        </div>
                      }
                      {selectedModule?.content?.map((moduleContent, index) => {
                        return (
                          <div key={moduleContent.id} className="flex items-center mb-4 gap-2">
                            <div className="">
                              <GripVertical />
                            </div>
                            <div className={`w-full flex justify-between items-center border cursor-pointer rounded-sm p-3`}>
                              <p className="text-sm">{moduleContent.title}</p>
                              <Video />
                            </div>
                            <div className="basis-[5%] ml-1">
                              <Trash />
                            </div>
                          </div>
                        );
                      })}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="bg-primary-100 mt-5 p-4 rounded-sm flex items-start justify-between">
                  <p className="text-xs basis-6/12 leading-5">Upload your existing content to automatically create a new lesson in this module</p>
                  <Dialog>
                    <DialogTrigger className="bg-primary border-0 p-2 text-sm cursor-pointer rounded-lg text-white basis-3/12 font-medium leading-6">
                      Upload content
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle></DialogTitle>
                        <div className="mb-8">
                          <Input
                            variant="text"
                            label="Title"
                            maxLength={54}
                            placeholder="Enter module title"
                            value={newModule}
                            onChange={(e) => setNewModule(e.target.value)}
                          />
                        </div>
                        <br />
                        <div className="">
                          <UploadInput
                            label="Upload Videos"
                            accept="video/*"
                            maxFiles={50}
                            onFilesChange={(files) => setFiles(files)}
                            errorMessage={files.length > 50 ? "You can only upload up to 50 files." : undefined}
                          />
                        </div>
                        <br />
                        <br />
                        <div className="mt-8">
                          <Button
                            type="submit"
                            className="bg-primary h-[50px] border-0 p-2.5 text-sm cursor-pointer rounded-lg text-white w-full font-medium leading-6"
                          >
                            Continue
                          </Button>
                        </div>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Curriculum;
