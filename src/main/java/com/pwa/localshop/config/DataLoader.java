package com.pwa.localshop.config;

import com.pwa.localshop.model.Producto;
import com.pwa.localshop.repository.ProductoRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner cargarProductosIniciales(ProductoRepository productoRepository) {
        return args -> {
            if (productoRepository.count() == 0) {
                productoRepository.saveAll(List.of(
                        new Producto(null, "Café orgánico", "Café de altura, tostado localmente.", 145.00,
                                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"),
                        new Producto(null, "Pan artesanal", "Pan de masa madre horneado cada mañana.", 65.00,
                                "https://images.unsplash.com/photo-1509440159596-0249088772ff"),
                        new Producto(null, "Miel natural", "Miel pura de productores de la región.", 120.00,
                                "https://images.unsplash.com/photo-1587049352846-4a222e784d38"),
                        new Producto(null, "Chocolate mexicano", "Chocolate oscuro elaborado con cacao mexicano.", 95.00,
                                "https://images.unsplash.com/photo-1548907040-4d42d8b1d41e")
                ));
            }
        };
    }
}
