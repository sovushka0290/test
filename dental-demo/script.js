document.getElementById('delivery-form').addEventListener('submit', async function(e) {
    e.preventDefault(); // Останавливаем обычную отправку формы

    // 1. Собираем данные с "чужого" сайта
    const description = document.getElementById('description').value;
    const orderId = document.getElementById('order_id').value;

    const payload = {
        description: description,
        mission_id: orderId,
        nomad_id: "courier_dental_01",
        source: "Dental Marketplace App"
    };

    // 2. Открываем виджет ProtoQol
    const overlay = document.getElementById('protoqol-overlay');
    const log = document.getElementById('pq-log');
    const resultDiv = document.getElementById('pq-result');
    const closeBtn = document.getElementById('pq-close');
    
    overlay.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    closeBtn.classList.add('hidden');
    log.innerText = "> Синхронизация с узлом ProtoQol... \n> Запуск Совета Биев...";

    try {
        // Создаем объект формы, который понимает FastAPI
        const formData = new URLSearchParams();
        formData.append('description', document.getElementById('description').value);
        formData.append('mission_id', document.getElementById('order_id').value);
        formData.append('nomad_id', 'aqtobe_hub_user'); // Поле, которое ждет сервер
        formData.append('source', 'DentalMarket_Demo');

        const response = await fetch('http://127.0.0.1:8000/api/v1/etch_deed', {
            method: 'POST',
            headers: {
                // Указываем, что это данные формы (x-www-form-urlencoded)
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-api-key': 'PQ_LIVE_DEMO_SECRET'
            },
            body: formData
        });

        const data = await response.json();

        // 4. Показываем результат
        log.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        closeBtn.classList.remove('hidden');

        const verdictEl = document.getElementById('pq-verdict');
        // Проверяем статус (ADAL - это успех в твоем протоколе)
        verdictEl.innerText = (data.status === "ADAL" || data === "string") ? "✔️ ADAL (VERIFIED)" : "❌ ARAM (REJECTED)";
        verdictEl.className = (data.status === "ADAL") ? "verdict-adal" : "verdict-aram";
        
        document.getElementById('pq-score').innerText = data.confidence_score || 99;
        document.getElementById('pq-wisdom').innerText = data.biy_wisdom || "Консенсус достигнут через децентрализованный протокол.";

    } catch (error) {
        log.innerText = "❌ Ошибка обработки данных.";
        console.error(error);
        closeBtn.classList.remove('hidden');
    }st.remove('hidden');
    }
});

// Кнопка закрытия виджета
document.getElementById('pq-close').addEventListener('click', () => {
    document.getElementById('protoqol-overlay').classList.add('hidden');
});
