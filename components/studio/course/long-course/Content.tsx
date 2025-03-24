"use client";
import React, { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Spinner from "@/components/Spinner";
import UploadMedia from "./UploadMedia";
import { Clipboard, GripVertical, PenBox, Plus, Trash, Video } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { addModuleService, fetchCourseDetailsService } from "@/services/module.service";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { resetCreateModuleForm, updatCreateModuleForm, updateSelectedModuleData } from "@/redux/slices/module.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.hook";
import { CreateModuleForm } from "@/types";
import { useCreateModuleFormValidator } from "@/helpers/validators/useCreateModule.validator";
import { useRouter, useSearchParams } from "next/navigation";
import { generalHelpers } from "@/helpers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";
import { useFetchCourseData } from "@/hooks/courses/useFetchCourseData";
import ButtonLoader from "@/components/ButtonLoader";

const Content = ({ courseId: id }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const currentModule = searchParams.get("module");
  const courseId = searchParams.get("edit");
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);

  const { data: courseData, isFetching: isFetchingCourse } = useFetchCourseData(courseId || id as any);

  const { createModuleForm: createModuleStateValues, selectedModuleData } = useAppSelector((store) => store.moduleStore);

  const { validate, errors, validateField } = useCreateModuleFormValidator({
    store: { ...createModuleStateValues, courseId: courseData?.data?.course?.id },
  });

  const { data: courseModulesData, isLoading: isModulesLoading } = useQuery<any>({
    queryKey: ["courseModulesData", selectedModuleData?.id],
    queryFn: async () => {
      const data = await fetchCourseDetailsService({
        courseId: courseId || id || courseData?.data?.course?.id,
        moduleId: selectedModuleData?.id,
      });
      return data;
    },
    enabled: !!id && !!courseData?.data?.course?.id && !!selectedModuleData?.id,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });

  const { mutate: handleAddModule, isPending: isAddingModule } = useMutation({
    mutationFn: (payload: CreateModuleForm) => addModuleService(payload),
    onSuccess: (newModule) => {
      toast.success("Module created");
      dispatch(resetCreateModuleForm());
      setShowCreateModule(false);
      setSelectedModule(newModule);
      if (!courseId) {
        router.push(`?module=${generalHelpers.convertToSlug(newModule.title)}`);
      } else {
        router.push(`?edit=${courseId}&module=${generalHelpers.convertToSlug(newModule.title)}`);
      }

      queryClient.setQueryData(["useFetchCourseData", courseId || courseData?.data?.course?.id], (oldData: any) => {
        if (!oldData?.data?.course) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            course: {
              ...oldData.data.course,
              modules: [...oldData.data.course.modules, newModule],
            },
          },
        };
      });

      // Invalidate related queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: ["useFetchCourseData", courseId || courseData?.data?.course?.id],
        exact: true
      });
    },
    onError: (error: any) => {
      toast.error(error?.data?.[0] || "Failed to create module");
    },
  });

  const updateCreateModule = useCallback(
    (payload: Partial<CreateModuleForm>) => dispatch(updatCreateModuleForm(payload)),
    [dispatch]
  );

  const updateSelectedModule = useCallback(
    (payload: Partial<any>) => dispatch(updateSelectedModuleData(payload)),
    [dispatch]
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      validate(() =>
        handleAddModule({
          courseId: Number(courseId) || Number(id) || Number(courseData?.data?.course?.id),
          difficultyLevel: courseModulesData?.module?.course?.difficultyLevel || courseData?.data?.course?.difficultyLevel,
          title: createModuleStateValues?.title,
          description: courseModulesData?.description || createModuleStateValues?.description,
        })
      );
    },
    [validate, handleAddModule, id, courseId, courseData?.data?.course?.id, courseData?.data?.course?.difficultyLevel, courseModulesData?.module?.course?.difficultyLevel, courseModulesData?.description, createModuleStateValues?.title, createModuleStateValues?.description]
  );

  const handleClickModule = useCallback(
    (module: any) => {
      setShowCreateModule(false);
      setSelectedModule(module);
      if (!courseId) {
        router.push(`?tab=content&module=${generalHelpers.convertToSlug(module.title)}`);
      } else {
        router.push(`?tab=content&edit=${courseId}&module=${generalHelpers.convertToSlug(module.title)}`);
      }
    },
    [courseId, router]
  );

  useEffect(() => {
    if (!courseData?.data?.course?.modules?.length || selectedModule || isFetchingCourse) return;

    const initialModule = courseData?.data?.course.modules[0];
    setSelectedModule(initialModule);
    const url = courseId
      ? `?tab=content&edit=${courseId}&module=${generalHelpers.convertToSlug(initialModule.title)}`
      : `?tab=content&module=${generalHelpers.convertToSlug(initialModule.title)}`;
    router.push(url);
  }, [courseId, courseData?.data?.course?.modules, router, selectedModule, isFetchingCourse]);

  useEffect(() => {
    if (selectedModule) {
      updateSelectedModule(selectedModule);
    }
  }, [selectedModule, updateSelectedModule]);

  const renderModulesList = useMemo(() => {
    if (isFetchingCourse) return <div className="h-[50vh] flex flex-col items-center justify-center"><Spinner /></div>;
    if (!courseData?.data?.course?.modules?.length) {
      return (
        <div className="h-full text-sm mb-4 flex flex-col justify-center items-center mt-28">
          <Clipboard />
          <p className="text-xl font-regular mt-4 font-semibold">Create module</p>
        </div>
      );
    }

    return courseData?.data?.course.modules.map((module: any, index: number) => {
      const isActive =
        generalHelpers.convertFromSlug(currentModule || courseData?.data?.course?.modules[0]?.title) ===
        generalHelpers.capitalizeWords(module.title);

      return (
        <div
          onClick={() => handleClickModule(module)}
          key={module.id}
          className={`w-full flex items-center border cursor-pointer rounded-sm ${isActive ? "border-primary-400" : "border-primary-100"}`}
        >
          <div className="p-3 flex items-center gap-2 text-left text-sm">
            <GripVertical />
            Module {index + 1}:
          </div>
          <div>
            <p className="text-sm">{module.title}</p>
          </div>
        </div>
      );
    });
  }, [courseData?.data?.course?.modules, currentModule, handleClickModule, isFetchingCourse]);

  const renderContentArea = useMemo(() => {
    if (isModulesLoading) return <div className="h-[50vh] flex flex-col items-center justify-center"><Spinner /></div>;

    if (showCreateModule) {
      return (
        <form onSubmit={handleSubmit}>
          <div className="mb-8">
            <Input
              variant="text"
              label="Title"
              maxLength={54}
              placeholder="Enter module title"
              value={createModuleStateValues.title}
              onChange={(e) => {
                updateCreateModule({ title: e.target.value });
                validateField("title", e.target.value);
              }}
              errorMessage={errors.title}
            />
          </div>
          <div className="mb-8">
            <Input
              variant="textarea"
              label="Module Description"
              maxLength={365}
              placeholder="Enter your module description"
              value={createModuleStateValues.description}
              onChange={(e) => {
                validateField("description", e.target.value);
                updateCreateModule({ description: e.target.value });
              }}
              errorMessage={errors.description}
              rows={10}
            />
          </div>
          <Button type="submit" className="w-full h-[50px]" disabled={isAddingModule}>
            <ButtonLoader
              isLoading={isAddingModule}
              caption="Continue"
            />
          </Button>
        </form>
      );
    }

    if (!selectedModule || !courseData?.data?.course?.modules?.length) {
      return (
        <div className="w-full mt-40 mx-auto flex flex-col items-center justify-center">
          <Video size={30} />
          <p className="text-xl tracking-wide">Add content to your module</p>
          <p className="text-sm mt-2">Create a new module</p>
        </div>
      );
    }

    return (
      <>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="w-full cursor-pointer rounded-md mb-4 border-none">
            <div className="flex items-center w-full">
              <div className="basis-[5%]">
                <GripVertical />
              </div>
              <div className="flex-1">
                <AccordionTrigger className="px-4 border w-full rounded-sm text-sm">
                  <p className="flex items-center gap-2">
                    {selectedModule.title} <PenBox size={16} />
                  </p>
                </AccordionTrigger>
              </div>
              <div className="basis-[5%] ml-1">
                <Trash />
              </div>
            </div>
            <AccordionContent className="px-10 mt-5 w-full mx-auto">
              {!courseModulesData?.module?.media?.length ? (
                <div className="w-full mt-6 mx-auto flex flex-col items-center justify-center">
                  <Video size={30} />
                  <p className="text-xl tracking-wide">Add content to your module</p>
                  <p className="text-sm mt-2">Create a new video</p>
                </div>
              ) : (
                courseModulesData?.module?.media.map((moduleContent: any) => (
                  <div key={moduleContent.id} className="flex items-center mb-4 gap-2">
                    <div className="basis-1/12">
                      <GripVertical />
                    </div>
                    <div className="flex-1 flex items-center border cursor-pointer rounded-sm px-2">
                      <div className="w-16 h-14 flex-shrink-0">
                        {moduleContent.mimeType === "image/*" ? (
                          <img
                            src={moduleContent.url || moduleContent.previewUrl}
                            alt={moduleContent.file?.name}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <video
                            src={moduleContent.url || moduleContent.previewUrl}
                            controls
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                      </div>
                      <div className="w-full flex justify-between items-center p-3">
                        <div>
                          <p className="text-sm font-semibold">{moduleContent.title}</p>
                          <p className="text-xs">{moduleContent.description}</p>
                        </div>
                        <Video size={30} />
                      </div>
                    </div>
                    <div className="basis-1/12 ml-1">
                      <Trash />
                    </div>
                  </div>
                ))
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <UploadMedia
          description="Upload your existing content to automatically create a new lesson in this module"
          queryClient={queryClient}
          moduleId={selectedModuleData?.id}
          courseId={Number(id) || Number(courseId) || Number(courseData?.data?.course?.id)}
        />
      </>
    );
  }, [isModulesLoading, showCreateModule, selectedModule, courseData?.data?.course?.modules?.length, courseData?.data?.course?.id, courseModulesData?.module?.media, queryClient, selectedModuleData?.id, courseId, id, handleSubmit, createModuleStateValues?.title, createModuleStateValues?.description, errors?.title, errors?.description, isAddingModule, updateCreateModule, validateField]);

  return (
    <div className="flex gap-4 w-full">
      <Card className="basis-4/12 border-none px-1">
        <CardHeader>
          <CardContent className="px-0 min-h-[58vh]">
            <aside className="h-full space-y-2">{renderModulesList}</aside>
          </CardContent>
          <CardFooter className="px-0 py-0 border-t">
            <Button variant="outline" onClick={() => setShowCreateModule(true)} className="w-full mt-2">
              <Plus size={16} /> Add New Module
            </Button>
          </CardFooter>
        </CardHeader>
      </Card>
      <Card className="flex-1 border-none px-0 py-0">
        <CardHeader>
          <CardContent className="px-0 py-0">{renderContentArea}</CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Content;