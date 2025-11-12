package com.miproyecto.shared.unitofwork;

import org.springframework.stereotype.Component;

@Component
public class UnitOfWorkImpl implements UnitOfWork {
    
    private boolean transactionActive = false;

    @Override
    public void commit() {
        if (!transactionActive) {
            throw new IllegalStateException("No hay transacción activa para confirmar");
        }
        System.out.println("Transacción confirmada - En producción esto confirmaría en BD");
        transactionActive = false;
    }

    @Override
    public void rollback() {
        if (!transactionActive) {
            throw new IllegalStateException("No hay transacción activa para deshacer");
        }
        System.out.println("Transacción deshecha - En producción esto haría rollback en BD");
        transactionActive = false;
    }

    @Override
    public boolean isActive() {
        return transactionActive;
    }

    @Override
    public void beginTransaction() {
        if (transactionActive) {
            throw new IllegalStateException("Ya hay una transacción activa");
        }
        transactionActive = true;
        System.out.println("Transacción iniciada");
    }

    @Override
    public void endTransaction() {
        transactionActive = false;
        System.out.println("Transacción finalizada");
    }
}