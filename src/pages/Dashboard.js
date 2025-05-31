
import { useEffect, useState, useRef } from "react";
import { Input } from "../components/ui";
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

    const chartCountRef = useRef(null);
    const canvasCountRef = useRef(null);
    const chartPriceRef = useRef(null);
    const canvasPriceRef = useRef(null);

    const importPieRef = useRef(null);
    const exportPieRef = useRef(null);
    const importPieChartRef = useRef(null);
    const exportPieChartRef = useRef(null);
    const [statisticData, setStatisticData] = useState([]);

    useEffect(() => {
        if (!statisticData.length || !importPieRef.current || !exportPieRef.current || !canvasCountRef.current || !canvasPriceRef.current) return;

        if (chartCountRef.current) chartCountRef.current.destroy();
        if (chartPriceRef.current) chartPriceRef.current.destroy();
        if (importPieChartRef.current) importPieChartRef.current.destroy()
        if (exportPieChartRef.current) exportPieChartRef.current.destroy();
        const ctxCount = canvasCountRef.current.getContext('2d');
        chartCountRef.current = new Chart(ctxCount, {
            type: 'bar',
            data: {
                labels: statisticData.map((data) => data.date),
                datasets: [
                    {
                        label: 'Số đơn nhập',
                        backgroundColor: 'rgba(75, 192, 192, 0.8)',
                        data: statisticData.map((data) => data.importCount),
                    },
                    {
                        label: 'Số đơn xuất',
                        backgroundColor: 'rgba(255, 99, 132, 0.8)',
                        data: statisticData.map((data) => data.exportCount),
                    },
                ]
            }
        });

        const ctxPrice = canvasPriceRef.current.getContext('2d');
        chartPriceRef.current = new Chart(ctxPrice, {
            type: 'bar',
            data: {
                labels: statisticData.map((data) => data.date),
                datasets: [
                    {
                        label: 'Số tiền nhập',
                        backgroundColor: 'rgba(214, 3, 0, 0.8)',
                        data: statisticData.map((data) => data.importPrice),
                    },
                    {
                        label: 'Số tiền xuất',
                        backgroundColor: 'rgba(76, 0, 248, 0.8)',
                        data: statisticData.map((data) => data.exportPrice),
                    },
                ]
            }
        });

        let importNew = 0;
        let importProcessing = 0;
        let importCompleted = 0;
        let exportPending = 0;
        let exportCompleted = 0;

        statisticData.forEach(item => {
            importNew += item.importNew || 0;
            importProcessing += item.importProcessing || 0;
            importCompleted += item.importCompleted || 0;
            exportPending += item.exportPending || 0;
            exportCompleted += item.exportCompleted || 0;
        });

        const ctEx = importPieRef.current.getContext("2d");
        importPieChartRef.current = new Chart(ctEx, {
            type: 'pie',
            data: {
                labels: ["Mới", "Đang xử lý", "Hoàn thành"],
                datasets: [{
                    data: [importNew, importProcessing, importCompleted],
                    backgroundColor: ['#4caf50', '#ffc107', '#2196f3'],
                }]
            }
        });

        const ctIm = exportPieRef.current.getContext("2d");
        exportPieChartRef.current = new Chart(ctIm, {
            type: 'pie',
            data: {
                labels: ["Đang chờ", "Hoàn thành"],
                datasets: [{
                    data: [exportPending, exportCompleted],
                    backgroundColor: ['#ff9800', '#3f51b5'],
                }]
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

    useEffect(() => handleView(), []);

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

        handleView();
    }, [fromDate, toDate]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4">
                <h1 className="font-bold text-3xl text-green-800 mb-4">
                    DASHBOARD
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                    <div className="flex items-center gap-2">
                        <label className="text-green-900 text-xl float-start">Từ</label>
                        <Input value={fromDate} onChange={handleSetFromDate} type="date" />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="text-green-900 text-xl float-start">Đến</label>
                        <Input value={toDate} onChange={handleSetToDate} type="date" />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 grid-rows-1 sm:grid-cols-2 gap-4 p-4 max-h-full">
                <div className="flex flex-col gap-4">
                    <div className="w-full">
                        <h3 className="text-xl font-bold text-green-800 text-center">Số phiếu nhập/xuất hoàn thành</h3>
                        <canvas ref={canvasCountRef} className="border border-black"></canvas>
                    </div>
                    <div className="w-full">
                        <h3 className="text-xl font-bold text-green-800 text-center mt-2">Số tiền đã nhập/xuất</h3>
                        <canvas ref={canvasPriceRef} className="border border-black"></canvas>
                    </div>
                </div>
                <div className="grid grid-rows-2 gap-4">
                    <div className="mt-4 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-green-800 text-center mb-2">Tỷ lệ tình trạng đơn nhập</h3>
                        <div className="h-full max-w-md">
                            <canvas ref={importPieRef} className="w-full h-full"></canvas>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-col items-center">
                        <h3 className="text-xl font-bold text-green-800 text-center mb-2">Tỷ lệ tình trạng đơn xuất</h3>
                        <div className="h-full max-w-md">
                            <canvas ref={exportPieRef} className="w-full h-full"></canvas>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
