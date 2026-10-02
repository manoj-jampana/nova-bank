package net.javaguides.banking.repository;
import net.javaguides.banking.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
    boolean existsByEmail(String email);
}
