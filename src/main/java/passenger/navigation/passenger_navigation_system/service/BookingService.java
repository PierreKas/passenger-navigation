package service;


import model.Booking;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.BookingRepository;

import java.util.List;
import java.util.Optional;
@Service
public class BookingService {
    @Autowired
    public BookingRepository bookingRepository;

    public Booking addBooking(Booking booking){
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBooking(){
        return bookingRepository.findAll();
    }

    public void deleteBookingById(Long bookingId){
        bookingRepository.deleteById(bookingId);
    }

    public Booking updateBooking(Long bookingId, Booking updatedData){
        Optional<Booking> existingBooking =bookingRepository.findById(bookingId);

        if (existingBooking.isPresent()){
            Booking booking=existingBooking.get();
            booking.setDestination(updatedData.getDestination());
            booking.setUser(updatedData.getUser());
            booking.setTravelDate(updatedData.getTravelDate());
            booking.setBus(updatedData.getBus());


            return bookingRepository.save(booking);
        }else {
            return null;
        }
    }
}
