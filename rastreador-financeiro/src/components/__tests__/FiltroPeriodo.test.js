import { render, screen, fireEvent } from '@testing-library/react'
import FiltroPeriodo from '../FiltroPeriodo'

function criarProps(extras = {}) {
    return {
        filtro: 'mes',
        onFiltro: jest.fn(),
        mes: 10,
        onMes: jest.fn(),
        ano: 2026,
        onAno: jest.fn(),
        anos: [2026, 2025],
        ...extras,
    }
}

describe('FiltroPeriodo', () => {
    test('no filtro mês mostra três selects', () => {
        render(<FiltroPeriodo {...criarProps()} />)
        expect(screen.getAllByRole('combobox')).toHaveLength(3)
    })

    test('no filtro semana mostra só o select de tipo', () => {
        render(<FiltroPeriodo {...criarProps({ filtro: 'semana' })} />)
        expect(screen.getAllByRole('combobox')).toHaveLength(1)
    })

    test('no filtro ano mostra o select de tipo e o de ano', () => {
        render(<FiltroPeriodo {...criarProps({ filtro: 'ano' })} />)
        expect(screen.getAllByRole('combobox')).toHaveLength(2)
    })

    test('avisa o tipo escolhido', () => {
        const props = criarProps()
        render(<FiltroPeriodo {...props} />)
        fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: 'ano' } })
        expect(props.onFiltro).toHaveBeenCalledWith('ano')
    })

    test('avisa o ano escolhido como número', () => {
        const props = criarProps()
        render(<FiltroPeriodo {...props} />)
        fireEvent.change(screen.getAllByRole('combobox')[2], { target: { value: '2025' } })
        expect(props.onAno).toHaveBeenCalledWith(2025)
    })
})