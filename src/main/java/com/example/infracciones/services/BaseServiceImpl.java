package com.example.infracciones.services;

import com.example.infracciones.entities.Base;
import com.example.infracciones.repositories.BaseRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.Serializable;
import java.util.List;
import java.util.stream.Collectors;

public abstract class BaseServiceImpl<E extends Base, D, ID extends Serializable>
        implements BaseService<E, D, ID> {

    protected BaseRepository<E, ID> baseRepository;

    public BaseServiceImpl(BaseRepository<E, ID> baseRepository) {
        this.baseRepository = baseRepository;
    }

    // Métodos abstractos que cada ServiceImpl va a implementar
    protected abstract D toDTO(E entity);
    protected abstract E toEntity(D dto);

    @Override
    @Transactional
    public List<D> findAll() throws Exception {
        try {
            return baseRepository.findAll().stream()
                    .map(this::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public Page<D> findAll(Pageable pageable) throws Exception {
        try {
            return baseRepository.findAll(pageable).map(this::toDTO);
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public D findById(ID id) throws Exception {
        try {
            return baseRepository.findById(id)
                    .map(this::toDTO)
                    .orElseThrow(() -> new Exception("Registro no encontrado con id: " + id));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public D save(D dto) throws Exception {
        try {
            E entity = toEntity(dto);
            return toDTO(baseRepository.save(entity));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public D update(ID id, D dto) throws Exception {
        try {
            E existing = baseRepository.findById(id)
                    .orElseThrow(() -> new Exception("Registro no encontrado con id: " + id));
            E entity = toEntity(dto);
            entity.setId(existing.getId());
            return toDTO(baseRepository.save(entity));
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    @Transactional
    public boolean delete(ID id) throws Exception {
        try {
            if (!baseRepository.existsById(id)) {
                throw new Exception("Registro no encontrado con id: " + id);
            }
            baseRepository.deleteById(id);
            return true;
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }
}
