"use client";
import React, { ReactNode, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, ButtonProps } from "@/components/ui/button";
import ButtonLoader from "./ButtonLoader";

type ButtonState = any;

type DialogButton = {
  caption: string;
  onClick: () => void;
  props?: ButtonState;
  variant?: ButtonProps["variant"];
};

type DialogStep = {
  title?: string;
  description?: string;
  showFooter?: boolean;
  content: (args: {
    setButtonProps: (buttons: DialogButton[]) => void;
    goNext: () => void;
    goBack: () => void;
    closeDialog: () => void;
  }) => ReactNode;
  buttons?: DialogButton[];
};

type MultiStepDialogFlowProps = {
  triggerButtonText: string;
  isTriggerButtonDisabled?: boolean;
  steps: DialogStep[];
  onComplete?: () => void;
};

export const MultiStepDialogFlow = ({
  triggerButtonText,
  isTriggerButtonDisabled,
  steps,
  onComplete,
}: MultiStepDialogFlowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [customButtons, setCustomButtons] = useState<DialogButton[]>([]);

  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      setCustomButtons([]);
    } else {
      setIsOpen(false);
      setCurrentStep(0);
      setCustomButtons([]);
      if (onComplete) onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCustomButtons([]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setCurrentStep(0);
    setCustomButtons([]);
    if (onComplete) onComplete();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCurrentStep(0);
      setCustomButtons([]);
    }
  };

  const currentDialog = steps[currentStep];

  const setButtonProps = (buttons: DialogButton[]) => {
    setCustomButtons(buttons);
  };

  const defaultButtons: DialogButton[] = [
    ...(currentStep > 0
      ? [
        {
          caption: "Back",
          onClick: handleBack,
          variant: "outline" as ButtonProps["variant"],
        },
      ]
      : []),
    {
      caption: currentStep === totalSteps - 1 ? "Finish" : "Next",
      onClick: handleNext,
    },
  ];

  const buttonsToRender = customButtons.length > 0 ? customButtons : (currentDialog.buttons || defaultButtons);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full" disabled={isTriggerButtonDisabled}>{triggerButtonText}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{currentDialog.title}</DialogTitle>
          {currentDialog.description && (
            <DialogDescription>{currentDialog.description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4">
          {currentDialog.content({
            setButtonProps,
            goNext: handleNext,
            goBack: handleBack,
            closeDialog: handleClose,
          })}
        </div>
        {currentDialog?.showFooter && (
          <DialogFooter>
            {buttonsToRender.map((button, index) => {
              return (
                <Button
                  key={index}
                  onClick={button.onClick}
                  disabled={button.props?.disabled}
                  variant={button.variant || "default"}
                >
                  <ButtonLoader
                    caption={button.caption}
                    isLoading={button.props?.loading}
                  />
                </Button>
              );
            })}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};