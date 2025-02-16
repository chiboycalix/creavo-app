"use client"
import React from 'react';
import Revenue from './Revenue';
import CompletionRate from './CompletionRate';


const RevenueAndCompletionCharts = () => {
  return (
    <div className="flex items-start gap-6">
      <Revenue />
      <CompletionRate />
    </div>
  );
};

export default RevenueAndCompletionCharts;