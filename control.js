const performCalculation = function (chosenCurrency) {
    const Bill = document.getElementById('bill');
    const RadioGroup = Array.from(document.getElementsByName('percent'));
    const CustomPercent = document.getElementById('percentCustom');
    const Clients = document.getElementById('client-count');

    const defaultValue = '0.00';
    const currency = chosenCurrency;
    let tipAmount = defaultValue;
    let total = defaultValue;

    const isFormValid = (element, ...rest) => {
        const collection = Array.isArray(element) ? element : [element];
        if (rest.length > 0) collection.push(...rest);

        for(let i = 0; i < collection.length; i++) {
            const { value } = collection[i];
            if(value === '' || value === '0')
                return false;
        }
        return true;
    }

    return (blurEvent) => {
        const Tip = RadioGroup.find(item => item.checked) || CustomPercent;
        if (Bill.value || Clients.value || Tip.value) {
           document.getElementsByClassName('info-outputs-panel__btn-reset')[0].removeAttribute('disabled');
        }
        if(isFormValid(Bill, Clients, Tip)) {
            const BillValue = +Bill.value;
            const ClientsValue = +Clients.value;
            let TipValue = +Tip.value;

            if(TipValue >= 1) TipValue = (TipValue / 100).toFixed(2);

            tipAmount = ((BillValue * TipValue) / ClientsValue).toFixed(2);
            total = ((BillValue / ClientsValue)  + +tipAmount).toFixed(2);
        } else {
            tipAmount = defaultValue;
            total = defaultValue;
        }
        document.getElementById('tip-amount').innerText = currency + tipAmount;
        document.getElementById('total').innerText = currency + total;
    }
}

const TipCalculator = {
    inputs: Array.from(document.getElementsByClassName('control__input-text')),
    radioGroup: document.querySelectorAll('input[type="radio"]'),
    custom: document.getElementById('percentCustom'),
    button: document.getElementsByClassName('info-outputs-panel__btn-reset')[0],
    currency: '$',
    recalculate: performCalculation('$'),
    handleInputValueChanges() {
        this.inputs.forEach((input) => {
            input.addEventListener('keydown', resolveNumber);
            input.addEventListener('keyup', this.recalculate);
            input.addEventListener('blur', this.recalculate);
        });
        this.radioGroup.forEach(input => {
            input.addEventListener('click', (mouseEvent) => {
                this.custom.value = '';
                this.recalculate(mouseEvent)
            });
        });
    },
    handleCustomPercent() {
        this.custom.addEventListener('click', () => {
            this.radioGroup.forEach(input => input.checked = false);
        });
    },
    reset() {
        this.button.toggleAttribute('disabled');
        this.radioGroup.forEach(input => input.checked = false);
        this.custom.value = '';
        document.getElementById('bill').value = '';
        document.getElementById('client-count').value = '';
        document.getElementById('tip-amount').innerText = this.currency + '0.00';
        document.getElementById('total').innerText = this.currency + '0.00';
    }
}

TipCalculator.handleInputValueChanges();
TipCalculator.handleCustomPercent();

function resolveNumber(keyboardEvent) {
    const { key, target } = keyboardEvent;
    const { selectionStart } = target;
    const { value } = this;

    if(key.length > 1) return;

    const nums = '0123456789';
    if(!nums.includes(key)) {
        keyboardEvent.preventDefault();
        return;
    }
    if (target.classList.contains('control__input-text_wrong')) {
        target.classList.remove('control__input-text_wrong');
        const errorCaption = document.getElementById(target.id + '-error');
        if(errorCaption) errorCaption.classList.remove('control__error_visible');
    }
    if(value === '0') {
        keyboardEvent.preventDefault();
        this.value = key;
        return;
    }
    if( key === '0'
        && value.length > 1
        && !selectionStart) {
        keyboardEvent.preventDefault();
    }
    if (key === '0' && !value) {
        target.classList.add('control__input-text_wrong');
        const errorCaption = document.getElementById(target.id + '-error');
        if(errorCaption) errorCaption.classList.add('control__error_visible');
    }
}
