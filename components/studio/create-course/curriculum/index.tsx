"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import { Clipboard, GripVertical, PenBox, Plus, Trash, Video } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/Input";
import { addModuleService, fetchModuleDetailsService } from "@/services/module.service";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { resetCreateModuleForm, updatCreateModuleForm, updateSelectedModuleData } from "@/redux/slices/module.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore.hook";
import { CreateModuleForm } from "@/types";
import { useCreateModuleFormValidator } from "@/helpers/validators/useCreateModule.validator";
import { useRouter, useSearchParams } from "next/navigation";
import { generalHelpers } from "@/helpers";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { fetctCourseService } from "@/services/course.service";
import { toast } from "sonner";
import UploadMedia from "./UploadMedia";

const Curriculum = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [selectedModule, setSelectedModule] = useState({}) as any;
  const searchParams = useSearchParams();
  const currentModule = searchParams.get("module");
  const updateCreateModule = (payload: Partial<CreateModuleForm>) => dispatch(updatCreateModuleForm(payload));
  const { createModuleForm: createModuleStateValues, selectedModuleData } = useAppSelector((store) => store.moduleStore);
  const { longCourseData: courseDataStateValues } = useAppSelector((store) => store.courseStore);
  const { validate, errors, validateField } = useCreateModuleFormValidator({ store: { ...createModuleStateValues, courseId: courseDataStateValues?.courseId } });
  const updateSelectedModule = (payload: Partial<any>) => dispatch(updateSelectedModuleData(payload));

  const { data: courseData } = useQuery({
    queryKey: ["courseData"],
    queryFn: async () => {
      const courseData = await fetctCourseService({
        courseId: courseDataStateValues?.courseId,
      });
      return courseData as any;
    },
    refetchInterval: 500,
    enabled: !!courseDataStateValues?.courseId,
    placeholderData: keepPreviousData,
  });

  const { data: moduleData } = useQuery({
    queryKey: ["moduleData"],
    queryFn: async () => {
      const moduleData = await fetchModuleDetailsService({
        courseId: courseDataStateValues?.courseId,
        moduleId: selectedModuleData?.id
      });
      return moduleData as any;
    },
    refetchInterval: 500,
    enabled: !!courseDataStateValues?.courseId,
    placeholderData: keepPreviousData,
  });

  const { mutate: handleAddModule, isPending: isAddingModule } = useMutation({
    mutationFn: (payload: CreateModuleForm) => addModuleService(payload),
    onSuccess: async (data) => {
      toast.success("Module created")
    },
    onError: (error: any) => {
      toast.error(error.data[0])
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    validate(() =>
      handleAddModule({
        courseId: courseDataStateValues?.courseId,
        difficultyLevel: courseDataStateValues?.difficultyLevel,
        title: createModuleStateValues?.title,
        description: createModuleStateValues?.description,
      })
    );
    dispatch(resetCreateModuleForm());
  };

  const handleClickModule = (module: any) => {
    setShowCreateModule(false);
    setSelectedModule(module);
    router.push(`?module=${generalHelpers.convertToSlug(selectedModule?.title)}`);
  };

  useEffect(() => {
    const path = selectedModule?.title ? `=${generalHelpers.convertToSlug(selectedModule?.title || createModuleStateValues?.title)}` : "";
    router.push(`?module${path}`);
  }, [selectedModule?.title, router, createModuleStateValues?.title]);


  useEffect(() => {
    if (courseData?.modules?.length > 0) {
      setSelectedModule(courseData?.modules[0]);
    }
  }, [courseData?.modules]);

  useEffect(() => {
    if (selectedModule) {
      updateSelectedModule({ ...selectedModule })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModule])

  return (
    <div className="flex gap-4 w-full">
      <Card className="basis-4/12 border-none px-1">
        <CardHeader>
          <CardTitle></CardTitle>
          <CardContent className="px-0 min-h-[58vh]">
            <aside className="h-full">
              {courseData?.modules.length === 0 ? (
                <div className="h-full text-sm mb-4 flex flex-col justify-center items-center mt-28">
                  <Clipboard />
                  <p className="text-xl font-regular mt-4 font-semibold">
                    Create module
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {courseData?.modules.map((module: any, index: number) => {
                    const isActive = generalHelpers.convertFromSlug(currentModule! || courseData?.modules[0]?.title || "") === generalHelpers.capitalizeWords(module?.title);
                    return (
                      <div
                        onClick={() => handleClickModule(module)}
                        key={module.id}
                        className={`w-full flex items-center border cursor-pointer rounded-sm 
                          ${isActive ? "border-primary-400" : "border-primary-100"}
                        `}
                      >
                        <div className="p-3 flex items-center gap-2 text-left text-sm">
                          <GripVertical />
                          Module {index + 1}:
                        </div>
                        <div>
                          <p className="text-sm">{module?.title}</p>
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
                {selectedModule?.metadata?.length === undefined &&
                  courseData?.modules.length === 0 ? (
                  <div className="w-full mt-40 mx-auto flex flex-col items-center justify-center">
                    <Video size={30} />
                    <p className="text-xl tracking-wide">
                      Add content to your module
                    </p>
                    <p className="text-sm mt-2">Create a new module</p>
                  </div>
                ) : (
                  <>
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
                          {moduleData?.module?.media?.length === 0 && (
                            <div className="w-full mt-6 mx-auto flex flex-col items-center justify-center">
                              <Video size={30} />
                              <p className="text-xl tracking-wide">
                                Add content to your module
                              </p>
                              <p className="text-sm mt-2">Create a new video</p>
                            </div>
                          )}
                          {moduleData?.module?.media?.map((moduleContent: any) => {
                            return (
                              <div
                                key={moduleContent?.id}
                                className="flex items-center mb-4 gap-2"
                              >
                                <div className="basis-1/12">
                                  <GripVertical />
                                </div>
                                <div className="flex-1 flex items-center border cursor-pointer rounded-sm px-2">
                                  <div className="w-16 h-14 flex-shrink-0">
                                    {moduleContent?.mimeType === "image/*" ? (
                                      <img
                                        src={moduleContent?.url || moduleContent?.previewUrl}
                                        alt={moduleContent?.file?.name}
                                        className="w-full h-full object-cover rounded"
                                      />
                                    ) : (
                                      <video
                                        src={moduleContent?.url || moduleContent?.previewUrl}
                                        controls
                                        className="w-full h-full object-cover rounded"
                                      />
                                    )}
                                  </div>
                                  <div
                                    className={`w-full flex justify-between items-center p-3`}
                                  >
                                    <div>
                                      <p className="text-sm font-semibold">
                                        {moduleContent?.title}
                                      </p>
                                      <p className="text-xs">
                                        {moduleContent?.description}
                                      </p>
                                    </div>
                                    <Video size={30} />
                                  </div>
                                </div>
                                <div className="basis-1/12 ml-1">
                                  <Trash />
                                </div>
                              </div>
                            );
                          }
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <UploadMedia
                      description="Upload your existing content to automatically create a new lesson in this module"
                    />
                  </>
                )}
              </div>
            )}
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default Curriculum;
