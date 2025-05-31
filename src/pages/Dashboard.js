
import { useEffect, useState, useRef } from "react";
import { Input, Button } from "../components/ui";
import { toast } from "react-toastify";
import { formatDate } from "../utils/format";
import * as request from "../utils/request";
import Chart from 'chart.js/auto';


const Dashboard = () => {
    const [fromDate, setFromDate] = useState(() => {
        const pastWeek = new Date();
        pastWeek.setDate(pastWeek.getDate() - 7);
        return formatDate(pastWeek);
    });

    const [toDate, setToDate] = useState(() => formatDate(new Date()));

    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const [statisticData, setStatisticData] = useState([]);

    useEffect(() => {
        if (!statisticData.length || !canvasRef.current) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        const ctx = canvasRef.current.getContext('2d');
        chartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: statisticData.map((data) => data.date),
                datasets: [
                    {
                        label: 'Số đơn nhập',
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        data: statisticData.map((data) => data.importCount),
                    },
                    {
                        label: 'Số đơn xuất',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        data: statisticData.map((data) => data.exportCount),
                    },
                ]
            }
        });
    }, [statisticData]);

    const handleSetFromDate = (e) => {
        const today = new Date();
        const date = e.target.value;

        if (new Date(date) > today) {
            toast.warn("Ngay bắt đầu không thể lớn hơn ngày hiện tại");
            setFromDate(formatDate(today));
            return;
        }
        setFromDate(date);
    };

    const handleSetToDate = (e) => {
        const today = new Date();
        const date = e.target.value;

        if (date < fromDate) {
            toast.warn("Ngày kết thúc không thể nhỏ hơn ngày bắt đầu");
            setToDate(formatDate(today));
            return;
        }

        setToDate(date);
    };

    const handleView = () => {
        const to = new Date(toDate);

        const tomorrow = new Date(to);
        tomorrow.setDate(to.getDate());

        request
            .get(`report/ImportExportSummaryPerDayReport`, {
                params: {
                    fromDate: fromDate,
                    toDate: tomorrow,
                },
            })
            .then((response) => {
                setStatisticData(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        const today = new Date();

        if (!fromDate) {
            const pastWeek = new Date();
            pastWeek.setDate(today.getDate() - 7);
            setFromDate(formatDate(pastWeek));
        }

        if (!toDate) {
            setToDate(formatDate(today));
        }
    }, [fromDate, toDate]);

    return (
        <div className="grid grid-cols-2 grid-rows-2 gap-4 p-4 max-h-full">
            <div>
                <div className="m-4"> 
                    <h1 className="font-bold text-3xl text-green-800 mb-4">
                        DASHBOARD
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                        <div>
                            <label className="text-green-900 text-xl float-start">Từ</label>
                            <Input value={fromDate} onChange={handleSetFromDate} type="date" />
                        </div>
                        <div>
                            <label className="text-green-900 text-xl float-start">Đến</label>
                            <Input value={toDate} onChange={handleSetToDate} type="date" />
                        </div>
                    </div>
                    <Button primary onClick={handleView}>
                        Xem
                    </Button>
                </div>
                <canvas ref={canvasRef} className="border border-black"></canvas>
            </div>
        </div>
    );
};

export default Dashboard;
