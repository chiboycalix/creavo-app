import React from 'react';
import Spinner from '@/components/Spinner';
import { Clipboard, GripVertical } from 'lucide-react';
import { generalHelpers } from '@/helpers';

interface ModulesListProps {
  isFetchingCourse: boolean;
  courseData: any;
  currentModule: string | null;
  handleClickModule: (module: any) => void;
}

const ModulesList: React.FC<ModulesListProps> = ({
  isFetchingCourse,
  courseData,
  currentModule,
  handleClickModule,
}) => {
  if (isFetchingCourse) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <Spinner />
      </div>
    );
  }

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
};

export default ModulesList;