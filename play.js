class Grid {

    constructor(element) {
        this.element = element

        this.init(this.element)
        this.resetButton()
        this.play(this.element)
    }

    /**
     * Initialize table
     */
    init(element) {
        this.reset(element)
    }

    /**
     * 
     * @param {DOMElement} table 
     */
    reset(element) {
        let cells = element.querySelectorAll('td')
        cells.forEach(cell => {
            cell.style.backgroundColor = ''
        });
        this.element.style.backgroundColor = ''
        sessionStorage.clear()
    }

    /**
     * 
     * @param {DOMElement} element 
     */
    resetButton() {
        let buttons = document.getElementsByClassName('reset')
        for(let button of buttons) {
            button.addEventListener('click', (e) => {
                e.preventDefault()
                this.reset(this.element)
            })
        }
    }
    
    /**
     * 
     * @param {DOMElement} element 
     */
    play(element) {
        element.addEventListener('click', (e) => {
            let cell = this.getCell(e)
            this.setValues(e, cell)
            sessionStorage.setItem(cell.coord, cell.value)
            this.checkResults(cell) ? this.win() : console.log(cell)
        })
    }
    
    /**
     * 
     * @param {event} e 
     */
    getCell(e) {
        let cellValue = Number(sessionStorage.getItem(e.target.getAttribute('id')))
        return {
            coord: e.target.getAttribute('id'),
            value: cellValue ? 0 : 1
        }
    }
    
    /**
     * 
     * @param {Object} cell 
     */
    setRowValue(cell) {
        let rowLetter = cell.coord.substr(0,1)
        let row = {
            letter: rowLetter,
            value: (rowLetter == 'C') ? (sessionStorage.getItem(rowLetter) ? Number(sessionStorage.getItem(rowLetter)) : 1) : (sessionStorage.getItem(rowLetter) ? Number(sessionStorage.getItem(rowLetter)) : 0)
        }
        row.value = (cell.value == 1) ? (row.value + cell.value) : (row.value - 1)
        sessionStorage.setItem(rowLetter, row.value)
    }

    /**
     * 
     * @param {Object} cell 
     */
    getRowValue(cell) {
        return Number(sessionStorage.getItem(cell.coord.substr(0,1)))
    }
    
    /**
     * 
     * @param {Object} cell 
     */
    setColumnValue(cell) {
        let columnNumber = cell.coord.substr(1)
        let column = {
            number: columnNumber,
            value: (columnNumber == 3) ? (sessionStorage.getItem(columnNumber) ? Number(sessionStorage.getItem(columnNumber)) : 1) : (sessionStorage.getItem(columnNumber) ? Number(sessionStorage.getItem(columnNumber)) : 0)
        }
        column.value = (cell.value == 1) ? (column.value + cell.value) : (column.value - 1)
        sessionStorage.setItem(columnNumber, column.value)
    }

    /**
     * 
     * @param {Object} cell 
     */
    getColumnValue(cell) {
        return Number(sessionStorage.getItem(cell.coord.substr(1)))
    }
    
    /**
     * 
     * @param {Object} cell 
     */
    setDiagValue(cell) {
        let diag = this.getDiag(cell)
        let diagValue = sessionStorage.getItem(diag) ? Number(sessionStorage.getItem(diag)) : 1 // C3 value
        diagValue = (cell.value == 1) ? (diagValue + cell.value) : ((diagValue == 2) ? 1 : diagValue - 1) 
        sessionStorage.setItem(diag, diagValue)
    }

    /**
     * Get diagonal value
     * @param {Object} cell 
     */
    getDiagValue(cell) {
        let diag = this.getDiag(cell)
        return diag !== '' ? Number(sessionStorage.getItem(diag)) : null
    }

    /**
     * Get diagonal starting side
     * @param {Object} cell 
     */
    getDiag(cell) {
        let leftDiag = ['A1', 'B2', 'D4', 'E5']
        let rightDiag = ['A5', 'B4', 'D2', 'E1']
        return leftDiag.includes(cell.coord) ? 'left' : (rightDiag.includes(cell.coord) ? 'right' : '')
    }

    /**
     * 
     * @param {event} e 
     * @param {Object} cell 
     */
    setValues(e, cell) {
        if(e.target.tagName == 'TD') {
            e.target.style.backgroundColor = (cell.value == 1) ? '#33b5e5' : ''
            this.setRowValue(cell)
            this.setColumnValue(cell)
            this.setDiagValue(cell)
        }
    }
    
    /**
     * 
     * @param {Object} cell 
     */
    checkResults(cell) {
        let results = [
            this.getRowValue(cell),
            this.getColumnValue(cell), 
            this.getDiagValue(cell)
        ]
        return results.includes(5)
    }
    
    /**
     * 
     */
    win() {
        this.reset(this.element)
        this.element.style.backgroundColor = '#00C851'
        $('#myModal').modal("show")
        //alert('Bravo !')
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Grid(document.getElementById('table'))
})