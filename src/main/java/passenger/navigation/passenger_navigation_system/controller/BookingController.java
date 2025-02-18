package controller;


import model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.BookingService;


import java.util.List;
@RestController
@RequestMapping("/api/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping(value = "/add",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Booking> addBooking(Booking booking){
        Booking savedBooking= bookingService.addBooking(booking);
        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBooking(){
        List<Booking> bookingList= bookingService.getAllBooking();
        return new ResponseEntity<>(bookingList,HttpStatus.OK);
    }

    @DeleteMapping("/{bookingId}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long bookingId){
        bookingService.deleteBookingById(bookingId);
        return new ResponseEntity<>("Bus deleted successfully", HttpStatus.OK);
    }

    @PutMapping(value = "/{bookingId}",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Booking> updateBooking(@PathVariable Long bookingId, @RequestBody Booking booking){
        Booking updatedBooking = bookingService.updateBooking(bookingId, booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }
}
