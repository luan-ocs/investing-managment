import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

ChartJS.register(ArcElement, Tooltip, Legend);

export type DataElement = {
  value: number;
  name: string;
  color: string;
};

type Props = {
  ChartTitle: string;
  dataElements: DataElement[];
  link?: {
    path: string;
    label: string;
  };
};

export const DoughnutChart = ({ dataElements, ChartTitle, link }: Props) => {
  const data: ChartData<'doughnut', number[], unknown> = {
    labels: dataElements.map((element) => element.name),
    datasets: [
      {
        label: ChartTitle,
        data: dataElements.map((element) => element.value),
        backgroundColor: dataElements.map((element) => element.color),
        borderColor: dataElements.map((element) => element.color),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex items-center w-full flex-col">
      <div
        className={`flex justify-${link ? 'between' : 'center'} w-full px-4`}
      >
        <p>{ChartTitle}</p>
        {link && (
          <Link to={link.path} className="text-teal-600">
            {link.label}
          </Link>
        )}
      </div>
      <div className="w-1/2 flex justify-center">
        <Doughnut data={data} />
      </div>
    </div>
  );
};

export default DoughnutChart;
