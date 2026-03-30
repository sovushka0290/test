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
        // 3. СТУЧИМСЯ В ТВОЙ БЭКЕНД PROTOQOL (Убедись, что порт 8000 верный)
        const response = await fetch('http://127.0.0.1:8000/api/v1/enterprise/etch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'PQ_LIVE_DEMO_SECRET' // Твой тестовый ключ
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // 4. Показываем результат в виджете
        log.classList.add('hidden'); // Прячем лог загрузки
        resultDiv.classList.remove('hidden');
        closeBtn.classList.remove('hidden');

        const verdictEl = document.getElementById('pq-verdict');
        verdictEl.innerText = data.status === "ADAL" ? "✔️ ADAL (VERIFIED)" : "❌ ARAM (REJECTED)";
        verdictEl.className = data.status === "ADAL" ? "verdict-adal" : "verdict-aram";
        
        document.getElementById('pq-score').innerText = data.confidence_score || 0;
        document.getElementById('pq-wisdom').innerText = data.biy_wisdom || "Транзакция записана в блокчейн.";

    } catch (error) {
        log.innerText = "❌ Ошибка соединения с ProtoQol Gateway.";
        console.error(error);
        closeBtn.classList.remove('hidden');
    }
});

// Кнопка закрытия виджета
document.getElementById('pq-close').addEventListener('click', () => {
    document.getElementById('protoqol-overlay').classList.add('hidden');
});
