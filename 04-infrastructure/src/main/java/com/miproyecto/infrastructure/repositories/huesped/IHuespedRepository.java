package com.miproyecto.infrastructure.repositories.huesped;

import com.miproyecto.domain.entities.huesped.Huesped;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IHuespedRepository extends JpaRepository<Huesped, Integer> {


}
