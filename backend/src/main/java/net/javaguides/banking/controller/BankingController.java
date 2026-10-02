package net.javaguides.banking.controller;
import jakarta.validation.Valid;
import net.javaguides.banking.dto.*;
import net.javaguides.banking.entity.*;
import net.javaguides.banking.service.BankingService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api")
@CrossOrigin(origins="*")
public class BankingController {
    private final BankingService service;
    public BankingController(BankingService service){this.service=service;}
    @PostMapping("/accounts") public ResponseEntity<Account> create(@Valid @RequestBody CreateAccountRequest r){return ResponseEntity.status(HttpStatus.CREATED).body(service.createAccount(r));}
    @GetMapping("/accounts") public List<Account> all(){return service.getAllAccounts();}
    @GetMapping("/accounts/{number}") public Account get(@PathVariable String number){return service.getAccount(number);}
    @PostMapping("/accounts/{number}/deposit") public Account deposit(@PathVariable String number,@Valid @RequestBody AmountRequest r){return service.deposit(number,r.amount());}
    @PostMapping("/accounts/{number}/withdraw") public Account withdraw(@PathVariable String number,@Valid @RequestBody AmountRequest r){return service.withdraw(number,r.amount());}
    @PostMapping("/transfers") public ResponseEntity<Void> transfer(@Valid @RequestBody TransferRequest r){service.transfer(r);return ResponseEntity.ok().build();}
    @GetMapping("/accounts/{number}/transactions") public List<BankTransaction> history(@PathVariable String number){return service.history(number);}
    @DeleteMapping("/accounts/{number}") public ResponseEntity<Void> delete(@PathVariable String number){service.deleteAccount(number);return ResponseEntity.noContent().build();}
}
