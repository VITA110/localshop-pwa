package com.pwa.localshop.controller;

import com.pwa.localshop.model.Producto;
import com.pwa.localshop.repository.ProductoRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("productos", productoRepository.findAll());
        return "index";
    }

    @PostMapping("/productos")
    public String crearProducto(
            @RequestParam String nombre,
            @RequestParam String descripcion,
            @RequestParam Double precio,
            @RequestParam(required = false) String imagenUrl) {
        productoRepository.save(new Producto(null, nombre, descripcion, precio, imagenUrl));
        return "redirect:/";
    }
}
