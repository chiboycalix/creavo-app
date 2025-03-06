"use client";
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CustomTab from '@/components/CustomTab';
import ProtectedRoute from '@/components/ProtectedRoute';
import Content from '@/components/studio/course/long-course/Content';
import Publish from '@/components/studio/course/long-course/Publish';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Clipboard, GripVertical, PenBox } from 'lucide-react';
import { useFetchCourseData } from '@/hooks/courses/useFetchCourseData';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore.hook';
import { fetchCourseDetailsService } from '@/services/module.service';
import { updateSelectedModuleData } from '@/redux/slices/module.slice';
import { generalHelpers } from '@/helpers';
import Spinner from '@/components/Spinner';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from '@/components/Input';

const Quiz = ({ courseId: id }: { courseId: any }) => {
  console.log({ id })
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const currentModule = searchParams.get("module");
  const courseId = searchParams.get("edit");
  const [showCreateModule, setShowCreateModule] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any | null>(null);
  const { createModuleForm: createModuleStateValues, selectedModuleData } = useAppSelector((store) => store.moduleStore);

  const { data: courseData, isFetching: isFetchingCourse } = useFetchCourseData(courseId || id as any);

  const { data: courseModulesData, isLoading: isModulesLoading } = useQuery<any>({
    queryKey: ["courseModulesData", selectedModuleData?.id],
    queryFn: async () => {
      const data = await fetchCourseDetailsService({
        courseId: courseId || courseData?.data?.course?.id,
        moduleId: selectedModuleData?.id,
      });
      return data;
    },
    enabled: !!courseData?.data?.course?.id && !!selectedModuleData?.id,
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });


  const updateSelectedModule = useCallback(
    (payload: Partial<any>) => dispatch(updateSelectedModuleData(payload)),
    [dispatch]
  );

  const handleClickModule = useCallback(
    (module: any) => {
      setShowCreateModule(false);
      setSelectedModule(module);
      if (!courseId) {
        router.push(`?tab=quiz&module=${generalHelpers.convertToSlug(module.title)}`);
      } else {
        router.push(`?tab=quiz&edit=${courseId}&module=${generalHelpers.convertToSlug(module.title)}`);
      }
    },
    [courseId, router]
  );

  useEffect(() => {
    if (!courseData?.data?.course?.modules?.length || selectedModule || isFetchingCourse) return;

    const initialModule = courseData?.data?.course.modules[0];
    setSelectedModule(initialModule);
    const url = courseId
      ? `?tab=quiz&edit=${courseId}&module=${generalHelpers.convertToSlug(initialModule.title)}`
      : `?tab=quiz&module=${generalHelpers.convertToSlug(initialModule.title)}`;
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

  return (
    <div className="flex gap-4 w-full">
      <Card className="basis-4/12 border-none px-1">
        <CardHeader>
          <CardContent className="px-0 min-h-[58vh]">
            <aside className="h-full space-y-2">{renderModulesList}</aside>
          </CardContent>
        </CardHeader>
      </Card>
      <Card className="flex-1 border-none px-0 py-0">
        <CardHeader>
          <CardContent className="px-0 py-0">
            <form onSubmit={() => { }}>
              <div>
                <Input
                  placeholder=''
                  label="Add Quiz Title"
                  onChange={() => { }}
                />
              </div>
            </form>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}

export default Quiz