package net.javaguides.banking.controller;

import net.javaguides.banking.dto.AdminUserResponse;
import net.javaguides.banking.dto.LoginRequest;
import net.javaguides.banking.dto.LoginResponse;
import net.javaguides.banking.service.AuthService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return authService.getAllUsers();
    }
}