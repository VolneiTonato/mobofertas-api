const operationCalc = ((value1, value2, operacao) => {

    value1 = isNaN(value1) ? 0 : value1
    value2 = isNaN(value2) ? 0 : value2

    switch (operacao) {
        case '+': return (parseFloat(value1) + parseFloat(value2))
        case '-': return (parseFloat(value1) - parseFloat(value2))
        case '/': return (parseFloat(value1) / parseFloat(value2))
        case '*': return (parseFloat(value1) * parseFloat(value2))
        default: return 0
    }
})





export const numeral = (value) => {
    if (typeof value === 'string') {
        return value.replace(/\D/g, '')
    }
}

export const calcularMargemLucro = (custo, precoVenda) => {

    return ((precoVenda - custo) / custo) * 100
}

export const calcularVariacaoMaiorParaMenor = (valorMaior, valorMenor) => {
    return ((valorMaior - valorMenor) / valorMaior) * 100
}

export const calcularVariacaoMenorParaMaior = (valorMaior, valorMenor) => {
    return ((valorMaior - valorMenor) / valorMenor) * 100
}


export const decimalToPercentual = (valorTotal = 0, desconto = 0) => {

    if (!valorTotal > 0 && !desconto > 0)
        return 0

    return calcularMargemLucro(desconto, valorTotal)


}



export const percentualToDecimal = (valorTotal, percentual, operacao = '+') => {

    if (percentual <= 0 || valorTotal <= 0)
        return 0

    if (operacao == '+')
        return cdbl(valorTotal) * (cdbl(percentual) / 100)
    else if (operacao == '-')
        return cdbl(valorTotal) * (cdbl(percentual) / 100)
    else
        return 0

}

export const calcularPercentual = (valor, percentual, operacao = '+') => {
    let number = 0


    valor = new Number(valor)

    percentual = new Number(percentual)

    if (operacao == '+')
        number = new Number(valor + (valor * (percentual / 100)))
    else if (operacao == '-')
        number = new Number(valor - (valor * (percentual / 100)))
    else
        return 0


    return number.toFixed(4).toString()
}

export const multiplicacaoArray = (data, prop1, prop2) => {
    let total = 0
    try {
        _.each(data, (obj) => {
            total += parseFloat(obj[prop1]) * parseFloat(obj[prop2])
        })


    } catch (err) {

    }
    return total
}

export const sumArrayProperty = (data, item) => {
    let total = 0
    try {
        _.each(data, (obj) => {
            total += parseFloat(obj[item])
        })


    } catch (err) {

    }
    return total
}

export const numberFormat = (value, decimals = 2, decPoint = '.', thousandsSep = ',') => {

    value = (value + '').replace(/,/g, '.')
    value = (value + '').replace(/[^0-9+\-Ee.]/g, '')
    let n = !isFinite(+value) ? 0 : +value
    let prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    let sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    let dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    let s = '';

    const toFixedFix = function (n, prec) {
        let k = Math.pow(10, prec)
        return '' + (Math.round(n * k) / k)
            .toFixed(prec)
    }

    // @todo: for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')


    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || ''
        s[1] += new Array(prec - s[1].length + 1).join('0')
    }

    return s.join(dec)
}


export const sum = (value1 = 0, value2 = 0) => {
    return operationCalc(value1, value2, '+')
}

export const diminuir = (value1 = 0, value2 = 0) => {
    return operationCalc(value1, value2, '-')
}

export const divisao = (value1 = 0, value2 = 0) => {
    return operationCalc(value1, value2, '/')
}

export const multiplicacao = (value1 = 0, value2 = 0) => {
    return operationCalc(value1, value2, '*')
}

export const cdbl = (value, decimais = 2) => {
    let aux = Number(value)

    if (isNaN(aux))
        return Number(0.00)

    let number = Number(aux).toFixed(decimais)

    return Number(number)
}

export const telefoneFormat = (number) => {
    let aux = numeral(number)

    let tamanho = aux.length

    let fone = `${aux.substr(0, 2)}`

    if (tamanho == 11)
        fone += `${aux.substr(2, 5)}-${aux.substr(7, 4)}`
    else
        fone += `${aux.substr(2, 4)}-${aux.substr(6, 4)}`

    return fone
}