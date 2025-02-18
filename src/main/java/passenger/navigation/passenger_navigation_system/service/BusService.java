package service;


import model.Bus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.BusRepository;


import java.util.List;
import java.util.Optional;
@Service
public class BusService {
    @Autowired
    public BusRepository busRepository;

    public Bus addBus(Bus bus){
        return busRepository.save(bus);
    }

    public List<Bus> getAllBuses(){
        return busRepository.findAll();
    }

    public void deleteBusById(Long busId){
        busRepository.deleteById(busId);
    }

    public Bus updateBus(Long busId, Bus updatedData){
        Optional<Bus> existingBus =busRepository.findById(busId);

        if (existingBus.isPresent()){
            Bus bus=existingBus.get();
            bus.setDestination(updatedData.getDestination());
            bus.setUser(updatedData.getUser());
            bus.setTravelDate(updatedData.getTravelDate());
            bus.setTotalNumberOfSeats(updatedData.getTotalNumberOfSeats());
            bus.setNumberOfAvailableSeats(updatedData.getNumberOfAvailableSeats());

            return busRepository.save(bus);
        }else {
            return null;
        }
    }
}
