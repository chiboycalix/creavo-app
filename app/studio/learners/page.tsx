import React from 'react';
import { CohortTable } from '@/components/cohort/CohortTable';

function Learner() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full mx-auto">
        <CohortTable />
      </div>
    </div>
  );
}

export default Learner;