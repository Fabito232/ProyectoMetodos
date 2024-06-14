import * as math from 'mathjs';

// Utilización promedio del sistema
export function calcularP(tasaLlegada, tasaServicio, numServidores) {
    let p = tasaLlegada / (tasaServicio * numServidores);
    return p;
}

// Probabilidad de que no haya clientes en el sistema
export function calcularP0(tasaLlegada, tasaServicio, numServidores) {
    let sumatoria = 0;

    // Suma la serie para la probabilidad de 0 clientes en el sistema
    for (let n = 0; n < numServidores; n++) {
        sumatoria += math.pow(tasaLlegada / tasaServicio, n) / math.factorial(n);
    }

    // Último término de la fórmula para P0
    let ultimoTermino = (math.pow(tasaLlegada / tasaServicio, numServidores) / math.factorial(numServidores)) * (1 / (1 - calcularP(tasaLlegada, tasaServicio, numServidores)));

    // Calcula P0
    let p0 = 1 / (sumatoria + ultimoTermino);
    return p0;
}

// Número promedio de clientes en la cola
export function calcularLq(tasaLlegada, tasaServicio, numServidores) {
    let Lq = (math.pow(tasaLlegada / tasaServicio, numServidores) * tasaLlegada * tasaServicio * calcularP0(tasaLlegada, tasaServicio, numServidores)) /
        (math.factorial(numServidores - 1) * math.pow(numServidores * tasaServicio - tasaLlegada, 2));
    return Lq;
}

// Número promedio de clientes en el sistema
export function calcularL(tasaLlegada, tasaServicio, numServidores) {
    let L = calcularLq(tasaLlegada, tasaServicio, numServidores) + (tasaLlegada / tasaServicio);
    return L;
}

// Tiempo promedio en cola
export function calcularWq(tasaLlegada, tasaServicio, numServidores) {
    let Wq = calcularLq(tasaLlegada, tasaServicio, numServidores) / tasaLlegada;
    return Wq;
}

// Tiempo promedio transcurrido en el sistema
export function calcularW(tasaLlegada, tasaServicio, numServidores) {
    let W = calcularWq(tasaLlegada, tasaServicio, numServidores) + (1 / tasaServicio);
    return W;
}

// Probabilidad de que un cliente tenga que esperar
export function calcularPw(tasaLlegada, tasaServicio, numServidores) {
    let Wp = (math.pow(tasaLlegada / tasaServicio, numServidores) / math.factorial(numServidores)) *
        (numServidores * tasaServicio) / (numServidores * tasaServicio - tasaLlegada) * calcularP0(tasaLlegada, tasaServicio, numServidores);
    return 1 - Wp;
}