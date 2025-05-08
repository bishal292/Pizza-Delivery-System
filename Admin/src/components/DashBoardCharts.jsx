import React, { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const DashBoardCharts = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);

  useEffect(() => {
    // Simulating fetching data
    const fetchRevenueData = async () => {
      const demoRevenue = [
        { month: "Jan", revenue: 12000, orders: 120 },
        { month: "Feb", revenue: 13500, orders: 140 },
        { month: "Mar", revenue: 11000, orders: 115 },
        { month: "Apr", revenue: 16000, orders: 155 },
        { month: "May", revenue: 17500, orders: 170 },
        { month: "Jun", revenue: 19000, orders: 180 },
        { month: "Jul", revenue: 20000, orders: 200 },
        { month: "Aug", revenue: 21000, orders: 215 },
        { month: "Sep", revenue: 22000, orders: 225 },
        { month: "Oct", revenue: 23000, orders: 230 },
        { month: "Nov", revenue: 24000, orders: 245 },
        { month: "Dec", revenue: 25000, orders: 260 },
      ];
      setRevenueData(demoRevenue);
    };

    const fetchOrderData = async () => {
      const demoOrderStatus = {
        placed: 400,
        delivered: 320,
        cancelled: 50,
        pending: 30,
      };
      setOrderData(demoOrderStatus);
    };

    fetchRevenueData();
    fetchOrderData();
  }, []);

  // Line Chart Data
  const lineChartData = {
    labels: revenueData.map((item) => item.month),
    datasets: [
      {
        label: "Monthly Revenue ($)",
        data: revenueData.map((item) => item.revenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Monthly Orders",
        data: revenueData.map((item) => item.orders),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Doughnut Chart Data
  const totalOrders = Object.values(orderData).reduce((a, b) => a + b, 0);
  const doughnutChartData = {
    labels: ["Placed", "Completed", "Cancelled", "Pending"],
    datasets: [
      {
        label: "Order Distribution",
        data: [
          orderData.placed,
          orderData.delivered,
          orderData.cancelled,
          orderData.pending,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)", // Placed
          "rgba(75, 192, 192, 0.8)", // Completed
          "rgba(255, 99, 132, 0.8)", // Cancelled
          "rgba(255, 206, 86, 0.8)", // Pending
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 2,
        borderRadius: 10, // Rounded corners
        hoverOffset: 10, // Add space when hovered
      },
    ],
  };

  // Options for Doughnut Chart
  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#333",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw;
            const percentage = ((value / totalOrders) * 100).toFixed(2);
            return `${tooltipItem.label}: ${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: "#fff",
        font: {
          size: 16,
          weight: "bold",
        },
        formatter: (value, context) => {
          const percentage = (
            (value / totalOrders) *
            100
          ).toFixed(1);
          return `${percentage}%`;
        },
      },
    },
  };

  return (
    <div className="w-full min-h-screen p-5 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Line Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full min-h-[400px]">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Monthly Revenue & Orders
            </h2>
            <Line data={lineChartData} />
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white shadow-lg rounded-lg p-6 w-full min-h-[400px]">
            <h2 className="text-xl md:text-2xl font-bold mb-4">
              Order Status Distribution
            </h2>
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardCharts;
