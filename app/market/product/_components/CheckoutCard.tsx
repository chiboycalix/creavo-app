"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { X, Search, DownloadIcon, PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/check-box";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { SelectInput } from "@/components/Input/SelectInput";
import { baseUrl } from "@/utils/constant";
import Cookies from "js-cookie";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;
      options.push({ label: time, value: time });
    }
  }
  return options;
};

interface AddEventCardProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
  eventToEdit?: any;
  product: any;
}

const CheckoutCard: React.FC<AddEventCardProps> = ({
  isOpen,
  onClose,
  eventToEdit,
  product,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const timeOptions = generateTimeOptions();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);

  console.log("here ", product);

  //   useEffect(() => {
  //     const handleClickOutside = (event: MouseEvent) => {
  //       if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
  //         onClose();
  //       }
  //     };
  //     document.addEventListener("mousedown", handleClickOutside);
  //     return () => document.removeEventListener("mousedown", handleClickOutside);
  //   }, [onClose]);

  const handleSubmit = async () => {
    console.log("submitting");
    setStep(2);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/20">
          <motion.div
            ref={cardRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="h-full w-full max-w-md bg-white shadow-lg overflow-y-auto"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Checkout</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {step === 1 && (
              <div className="p-4 border-t border-gray-200">
                <div className="">
                  <h2>Contact Information</h2>
                </div>

                <div className="flex flex-col p-4 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Name</Label>
                      <Input
                        id="title"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        type="text"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Email</Label>
                      <Input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        type="email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <PhoneInput
                        country={"ng"}
                        value={phone}
                        onChange={setPhone}
                        inputProps={{
                          name: "phone",
                          required: true,
                        }}
                        containerClass="w-[100%] rounded-md"
                                      
                      />
                    </div>
                  </div>

                  <div className="space-y-4 flex flex-col bg-[#D1DCF180] p-3 rounded-md">
                    <div className="flex justify-between">
                      <div>Sub Total</div>
                      <div>${product?.price} </div>
                    </div>
                    <div className="flex justify-between">
                      <div>Total</div>
                      <div>${product?.price} </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-gray-200">
                  <Button
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    onClick={handleSubmit}
                  >
                    {`Pay $${product?.price}`}
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className=" flex flex-col p-4 border-t border-gray-200">
                <div className="border-b-2 pb-4">
                  <h2>Purchase Successful!</h2>
                </div>

                <div className=" space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center border-b-2 gap-2 py-4">
                      <h2 className="font-bold">
                        {`Hi ${name}, Thanks for your purchase`}{" "}
                      </h2>
                      <div>
                        <img src={"/assets/purchaseSuccess.png"} alt="" />
                      </div>
                    </div>

                    <div className="flex justify-between gap-4 border-b-2 pb-4">
                      <div className="flex flex-col justify-between">
                        <div className="text-sm">Reference</div>
                        <div className="text-sm font-bold">UDH349490</div>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div className="text-sm">Date</div>
                        <div className="text-sm font-bold">March 5th, 2025</div>
                      </div>

                      <div className="flex flex-col justify-between">
                        <div className="text-sm">Time</div>
                        <div className="text-sm font-bold">10:35 AM</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="pb-4 border-b-2">Product Summary</h2>
                      <div className=" flex flex-col gap-3 border-2 rounded-md p-3 border-[#EFEFEF] ">
                        <div className="flex items-start gap-2 ">
                          <div className=" h-auto ">
                            <img
                              src={product?.seller?.avatar}
                              alt=""
                              className=""
                            />
                          </div>

                          <div className="flex flex-col gap-2 w-full pr-5">
                            <p className="mt-3 font-bold text-right">
                              {product?.title}
                            </p>
                            <p className="text-right">{`Quantity: 1`}</p>
                          </div>
                        </div>
                        <Button
                          className="w-36 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-md text-sm"
                          onClick={() => console.log("clicked")}
                        >
                          Write a review
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 py-4 border-gray-200 mt-10">
                  <Button
                    className="w-full bg-white hover:bg-primary-700 hover:text-white text-[#0073B4] border-2 border-[#0073B4]"
                    onClick={handleSubmit}
                  >
                    <DownloadIcon /> <span>Download Receipt</span>
                  </Button>
                  <Button
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white"
                    onClick={handleSubmit}
                  >
                    <PrinterIcon /> <span>Print Receipt</span>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutCard;
