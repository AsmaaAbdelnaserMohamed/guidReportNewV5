import { client } from "../db_connection.js";

const insertData = async (formData, files) => {
    // الحصول على مسارات الملفات
    const kroquiImagePath = files && files['kroqui-image'] ? files['kroqui-image'][0].path : null;
    const cameraImagePath = files && files['camera_image'] ? files['camera_image'][0].path : null;
    const applicantSignaturePath = files && files['applicant-signature'] ? files['applicant-signature'][0].path : null;
    const surveyorSignaturePath = files && files['surveyor-signature'] ? files['surveyor-signature'][0].path : null;

    // تنسيق التاريخ ليتناسب مع PostgreSQL
    const date = formData.date ? formData.date : null;

    // Ensure date is in 'YYYY-MM-DD' format
    const formattedDate = date && !isNaN(Date.parse(date)) ? new Date(date).toISOString().split('T')[0] : null;

    const query = `
    INSERT INTO guidreportrscdata_testtrigger (
        request_number,
        requestid,
        requester_name,
        sector,
        parcel_number,
        plot_number,
        plan_number,
        north_border,
        north_border_length,
        south_border,
        south_border_length,
        east_border,
        east_border_length,
        west_border,
        west_border_length,
        latitude,
        longitude,
        address,
        area_request,
        area_survey,
        description,
        usage_building,
        surveyor_name,
        applicant_name,
        company_code,
        date,
        evaluation,
        description_nearest_sign,
        detailed_address,
        floor_number,
        actual_apartment_number,
        survey_apartment_number,
        survey_type,
        floor_number_text,
        ssec,
        iqrar_name,
        sector_text,
        ssec_text,
        kroqui_image_path,
        camera_image_path,
        signature_surveyor_path,
        signature_applicant_path
    ) VALUES (
        $1, 
        $2,
        $3, 
        $4, 
        $5, 
        $6, 
        $7, 
        $8, 
        $9, 
        $10, 
        $11, 
        $12, 
        $13, 
        $14, 
        $15, 
        $16, 
        $17, 
        $18, 
        $19, 
        $20,
        $21, 
        $22, 
        $23, 
        $24, 
        $25, 
        $26, 
        $27, 
        $28, 
        $29, 
        $30, 
        $31, 
        $32, 
        $33, 
        $34, 
        $35, 
        $36, 
        $37, 
        $38,
        $39,
        $40,
        $41,
        $42
    )
    `;
    const values = [
        formData.requestNumber,               // $1: رقم الطلب
        formData.requestid,                   // $2: معرف الطلب
        formData.requesterName,               // $3: اسم الطالب
        formData.sector,                      // $4: القطاع
        formData.parcelNumber,                // $5: رقم القطعة
        formData.plotNumber,                  // $6: رقم المخطط
        formData.planNumber,                  // $7: رقم الخطة
        formData.northBorder,                 // $8: الحدود الشمالية
        formData.northBorderLength ? parseFloat(formData.northBorderLength) : null,  // $9: طول الحدود الشمالية
        formData.southBorder,                 // $10: الحدود الجنوبية
        formData.southBorderLength ? parseFloat(formData.southBorderLength) : null,  // $11: طول الحدود الجنوبية
        formData.eastBorder,                  // $12: الحدود الشرقية
        formData.eastBorderLength ? parseFloat(formData.eastBorderLength) : null,    // $13: طول الحدود الشرقية
        formData.westBorder,                  // $14: الحدود الغربية
        formData.westBorderLength ? parseFloat(formData.westBorderLength) : null,    // $15: طول الحدود الغربية
        formData.latitude ? parseFloat(formData.latitude) : null,                    // $16: خط العرض
        formData.longitude ? parseFloat(formData.longitude) : null,                  // $17: خط الطول
        formData.address,                     // $18: العنوان
        formData.areaRequest ? parseFloat(formData.areaRequest) : null,              // $19: مساحة الطلب
        formData.areaSurvey ? parseFloat(formData.areaSurvey) : null,                // $20: مساحة المسح
        formData.description,                 // $21: الوصف
        formData.usageBuilding ? parseInt(formData.usageBuilding) : null,               // $22: استخدام البناء
        formData.surveyorName,                // $23: اسم المساح
        formData.applicantName,               // $24: اسم المتقدم
        formData.surveyTeamId,                 // $25: كود الطاقم
        formattedDate,                        // $26: التاريخ المنسق
        formData.evaluation,                  // $27: التقييم
        formData.descriptionNearestSign,      // $28: وصف أقرب علامة
        formData.detailed_address,            // $29: العنوان التفصيلي
        formData.floor_number,                // $30: رقم الطابق
        formData.actual_apartment_number,     // $31: رقم الشقة الفعلي
        formData.survey_apartment_number,     // $32: رقم شقة المسح
        formData.survey_type ? parseInt(formData.survey_type) : null,                 // $33: نوع المسح
        formData.floor_number_text,           // $34: نص رقم الطابق
        formData.ssec,                        // $35: الفرع الثانوي
        formData.iqrarName,                  // $36: اسم الإقرار      
        formData.secText,                    // $37
        formData.ssecText,                    // $38
        kroquiImagePath,                      // $39: مسار صورة الكروكي
        cameraImagePath,                      // $40: مسار صورة الكاميرا
        surveyorSignaturePath,                // $41: مسار توقيع المساح
        applicantSignaturePath                // $42: مسار توقيع المتقدم
    ];


    try {
        await client.query(query, values);
        return { success: true, message: 'Data and files uploaded successfully' };
    } catch (err) {
        console.error('Error inserting data:', err);
        return { success: false, error: 'Error inserting data', details: err };
    }
};

// وظيفة للحصول على جميع البيانات
const selectAllData = async () => {
    try {
        const query = 'SELECT * FROM guidreportrscdata';
        const result = await client.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export { insertData, selectAllData };
