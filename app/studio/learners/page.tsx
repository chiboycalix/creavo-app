import React from 'react';
import { CohortTable } from '@/components/cohort/CohortTable';

function Learner() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <CohortTable />
      </div>
    </div>
  );
}

export default Learner;