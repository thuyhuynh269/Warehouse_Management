import { useEffect, useState } from "react";
import { Input } from "../components/ui";
import { toast } from "react-toastify";
import { formatDate } from "../utils/format";
import * as request from "../utils/request";

const Statistic = () => {
    const [fromDate, setFromDate] = useState(() => {
        const pastWeek = new Date();
        pastWeek.setDate(pastWeek.getDate() - 7);
        return formatDate(pastWeek);
    });

    const [toDate, setToDate] = useState(() => formatDate(new Date()));

    const [statisticData, setStatisticData] = useState([]);

    const handleSetFromDate = (e) => {
        const today = new Date();
        const date = e.target.value;

        if (new Date(date) > today) {
            toast.warn("The start date cannot be greater than the current date");
            setFromDate(formatDate(today));
            return;
        }

        setFromDate(date);
    };

    const handleSetToDate = (e) => {
        const today = new Date();
        const date = e.target.value;

        if (date < fromDate) {
            toast.warn("The end date cannot be smaller than the start date");
            setToDate(formatDate(today));
            return;
        }

        setToDate(date);
    };

    const handleView = () => {
        const to = new Date(toDate);

        const tomorrow = new Date(to);
        tomorrow.setDate(to.getDate() + 1);

        request
            .get(`report/product-inventory`, {
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

        handleView();
    }, [fromDate, toDate]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center justify-between p-4">
                <h1 className="font-bold text-3xl text-green-800 mb-4">
                    THỐNG KÊ SẢN PHẨM
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
            <table className="min-w-full bg-white border-2 border-green-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-r-2 border-b-2">ID</th>
                            <th className="py-2 px-4 border-r-2 border-b-2">Product name</th>
                            <th className="py-2 px-4 border-r-2 border-b-2">Tồn kho</th>
                            <th className="py-2 px-4 border-r-2 border-b-2">Số lượng nhập</th>
                            <th className="py-2 px-4 border-r-2 border-b-2">Tổng giá nhập</th>
                            <th className="py-2 px-4 border-r-2 border-b-2">Số xuất</th>
                            <th className="py-2 px-4 border-b-2">Tổng giá xuất</th>
                        </tr>
                    </thead>
                    <tbody>
                        {statisticData.map((data) => (
                            <tr key={data.proId} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-r border-t-2 text-center">
                                    {data.proId}
                                </td>
                                <td className="py-2 px-4 border-r border-t-2 text-left">
                                    {data.proName}
                                </td>
                                <td className="py-2 px-4 border-r border-t-2 text-center">
                                    {data.remainingStock}
                                </td>
                                <td className="py-2 px-4 border-r border-t-2 text-center">
                                    {data.totalImported}
                                </td>
                                <td className="py-2 px-4 border-r border-t-2 text-center">
                                    {data.totalImportPrice}
                                </td>
                                <td className="py-2 px-4 border-r border-t-2 text-center">
                                    {data.totalExported}
                                </td>
                                <td className="py-2 px-4 border-t-2 text-right">
                                    {data.totalExportPrice}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
};

export default Statistic;