package com.miproyecto.infrastructure.persistence;

// COMENTADO TEMPORALMENTE - NECESITA JPA CONFIGURADO
/*
import com.miproyecto.shared.unitofwork.UnitOfWork;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
@Transactional
public class UnitOfWorkJpa implements UnitOfWork {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void commit() {
        entityManager.flush();
    }

    @Override
    public void rollback() {
        entityManager.clear();
        throw new RuntimeException("Rollback de transacción");
    }

    @Override
    public boolean isActive() {
        return entityManager != null && entityManager.isOpen();
    }

    @Override
    public void beginTransaction() {
        System.out.println("Transacción JPA iniciada (manejada por Spring)");
    }

    @Override
    public void endTransaction() {
        System.out.println("Transacción JPA finalizada (manejada por Spring)");
    }
}
*/