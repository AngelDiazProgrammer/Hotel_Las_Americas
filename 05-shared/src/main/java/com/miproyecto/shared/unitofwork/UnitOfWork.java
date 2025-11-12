package com.miproyecto.shared.unitofwork;

import org.springframework.transaction.annotation.Transactional;

@SuppressWarnings("unused")
public interface UnitOfWork {
    
    /**
     * Confirma todas las operaciones realizadas en la transacción
     */
    void commit();
    
    /**
     * Deshace todas las operaciones realizadas en la transacción
     */
    void rollback();
    
    /**
     * Indica si hay una transacción activa
     */
    boolean isActive();
    
    /**
     * Inicia una nueva transacción
     */
    void beginTransaction();
    
    /**
     * Finaliza la transacción actual
     */
    void endTransaction();
}