package net.javaguides.banking.dto;

public record AdminUserResponse(
        Long id,
        String name,
        String email,
        String role
) {
}