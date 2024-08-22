// listdata.controller.js

import { getDataByUserId } from "../../../Database/models/listdata.model.js";

const getData = async (req, res) => {
    const userId = req.userId;
    const limit = parseInt(req.query.limit, 10) || 5;
    const offset = parseInt(req.query.offset, 10) || 0;
    const search = req.query.search || '';

    console.log('Fetching data for userId:', userId, 'Limit:', limit, 'Offset:', offset, 'Search:', search);

    try {
        // الحصول على جميع البيانات
        const { data, total, filteredTotal } = await getDataByUserId(userId, search);

        // تقسيم البيانات إلى صفحات
        const paginatedData = data.slice(offset, offset + limit);

        if (paginatedData.length === 0) {
            return res.status(404).json({ message: 'لا توجد بيانات لهذا المستخدم.' });
        }

        res.json({
            pagination: {
                total,
                filteredTotal,
                limit,
                offset,
                currentPage: Math.floor(offset / limit) + 1,
                totalPages: Math.ceil(total / limit),
                filteredTotalPages: Math.ceil(filteredTotal / limit)
            },
            data: paginatedData
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'حدث خطأ في استعلام قاعدة البيانات.' });
    }
};

export { getData };
