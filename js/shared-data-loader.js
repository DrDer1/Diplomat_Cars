(function() {
    'use strict';

    const SHARED_DATA_URL = 'data/shared-data.json';
    let sharedData = {
        whatsapp_numbers: {
            rustaq: [],
            mabela: []
        },
        car_images: {}
    };
    let isLoaded = false;
    let isLoading = false;

    function loadSharedData() {
        if (isLoading) return;
        isLoading = true;
        return fetch(SHARED_DATA_URL + '?t=' + Date.now())
            .then(function(response) {
                if (!response.ok) throw new Error('فشل تحميل البيانات المشتركة');
                return response.json();
            })
            .then(function(data) {
                if (data.whatsapp_numbers) {
                    if (data.whatsapp_numbers.rustaq && data.whatsapp_numbers.rustaq.length > 0) {
                        sharedData.whatsapp_numbers.rustaq = data.whatsapp_numbers.rustaq;
                    }
                    if (data.whatsapp_numbers.mabela && data.whatsapp_numbers.mabela.length > 0) {
                        sharedData.whatsapp_numbers.mabela = data.whatsapp_numbers.mabela;
                    }
                }
                if (data.car_images) {
                    sharedData.car_images = data.car_images;
                }
                isLoaded = true;
                isLoading = false;
                console.log('✅ تم تحميل البيانات المشتركة');
                if (window.onSharedDataLoaded) {
                    window.onSharedDataLoaded();
                }
            })
            .catch(function(error) {
                console.warn('⚠️ تعذر تحميل البيانات المشتركة، استخدام الإعدادات الافتراضية:', error.message);
                isLoading = false;
            });
    }

    function getWhatsAppNumbers(branch) {
        if (isLoaded && sharedData.whatsapp_numbers[branch] && sharedData.whatsapp_numbers[branch].length > 0) {
            return sharedData.whatsapp_numbers[branch];
        }
        return null;
    }

    function getAllWhatsAppNumbers() {
        return {
            rustaq: sharedData.whatsapp_numbers.rustaq.length > 0 ? sharedData.whatsapp_numbers.rustaq : null,
            mabela: sharedData.whatsapp_numbers.mabela.length > 0 ? sharedData.whatsapp_numbers.mabela : null
        };
    }

    function getCarImageUrl(carName, category, model, branch) {
        var carKey = generateCarKey(carName, category, model, branch);
        if (sharedData.car_images && sharedData.car_images[carKey]) {
            return sharedData.car_images[carKey];
        }
        return null;
    }

    function generateCarKey(carName, category, model, branch) {
        var str = (branch + '_' + carName + '_' + category + '_' + model).toLowerCase();
        return str.replace(/[^a-z0-9\u0600-\u06FF_]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    }

    function isDataLoaded() {
        return isLoaded;
    }

    window.diplomatSharedData = {
        loadSharedData: loadSharedData,
        getWhatsAppNumbers: getWhatsAppNumbers,
        getAllWhatsAppNumbers: getAllWhatsAppNumbers,
        getCarImageUrl: getCarImageUrl,
        generateCarKey: generateCarKey,
        isDataLoaded: isDataLoaded
    };

})();
