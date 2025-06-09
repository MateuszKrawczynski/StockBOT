let stock_points = [];
let model_trained = false;
let weights = [0.01, 0.01, 0.01];
let bias = 0.0;

function linear_regression(x) {
    return bias + x;
}

function loss(y, y_hat) {
    return ((y - y_hat) * (y - y_hat)) / 2;
}

function calculate_weight(w, y_hat, y, x) {
    if (isNaN(w) || isNaN(y_hat) || isNaN(y) || isNaN(x)) {
        console.error("NaN in calculate_weight", { w, y_hat, y, x });
        return w;
    }
    return w - (0.01 * (y_hat - y) * x);
}

function calculate_bias(b, y_hat, y) {
    if (isNaN(b) || isNaN(y_hat) || isNaN(y)) {
        console.error("NaN in calculate_bias", { b, y_hat, y });
        return b;
    }
    return b - (0.01 * (y_hat - y));
}

function add_point() {
    let price = parseFloat(document.getElementById("stock_price").value);
    let day = parseInt(document.getElementById("day").value);
    let month = parseInt(document.getElementById("month").value);
    let year = (parseInt(document.getElementById("year").value) - 2000) / 50;

    if (isNaN(price) || isNaN(day) || isNaN(month) || isNaN(year)) {
        alert("Enter valid data!");
        return;
    }

    stock_points.push({ price, day, month, year });
    document.getElementById("points").innerHTML += `<h3>${price} | ${day}.${month}.${year}</h3>`;
}

function calculate_next() {
    let day = parseInt(document.getElementById("day_pred").value);
    let month = parseInt(document.getElementById("month_pred").value);
    let year = (parseInt(document.getElementById("year_pred").value) - 2000) /50;

    if (isNaN(day) || isNaN(month) || isNaN(year)) {
        alert("Enter a real date!");
        return;
    }

    let x = weights[0] * day + weights[1] * month + weights[2] * year;
    let stock = linear_regression(x);
    if (isNaN(stock)) {
        document.getElementById("predicted_stock").innerHTML = `<h1>ERROR</h1>`;
    } else {
        document.getElementById("predicted_stock").innerHTML = `<h1>Predicted stock price: ${stock.toFixed(2)}</h1>`;
    }
}

function predict() {
    if (!model_trained && stock_points.length > 0) {
        for (let i = 0; i < 150000; i++) {
            stock_points.forEach((record) => {
                let y = record.price;
                let day = record.day;
                let month = record.month;
                let year = record.year;

                let x = weights[0] * day + weights[1] * month + weights[2] * year;
                let y_hat = linear_regression(x);

                if (isNaN(y) || isNaN(y_hat) || isNaN(x)) {
                    console.warn("Pominięto rekord z powodu NaN", record);
                    return;
                }

                bias = calculate_bias(bias, y_hat, y);
                weights[0] = calculate_weight(weights[0], y_hat, y, day);
                weights[1] = calculate_weight(weights[1], y_hat, y, month);
                weights[2] = calculate_weight(weights[2], y_hat, y, year);
            });
        }
        console.log(`FINALNE WAGI: ${weights}, BIAS: ${bias} , LOSS: ${loss(stock_points[0].price,linear_regression(weights[0] * stock_points[0].day + weights[1] * stock_points[0].month + weights[2] * stock_points[0].year))}`);
        model_trained = true;
    }

    calculate_next();
}