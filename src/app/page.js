// src/app/page.js
'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [jobs] = useState([
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Remote',
      salary: '$120,000 - $180,000'
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'StartupCo',
      location: 'New York, NY',
      type: 'Hybrid',
      salary: '$100,000 - $150,000'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Openings</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Link href={`/jobs/${job.id}`} key={job.id}>
              <div className="bg-white shadow-sm rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <p className="text-gray-500">{job.company}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-sm text-gray-500">{job.location}</span>
                      <span className="text-sm text-gray-500">{job.type}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-medium">{job.salary}</p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mt-2">
                      Apply Now
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}