package controller;


import model.Bus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.BusService;


import java.util.List;
@RestController
@RequestMapping("/api/bus")
public class BusController {
    @Autowired
    private BusService busService;

    @PostMapping(value = "/add",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Bus> addBus(Bus bus){
        Bus savedBus= busService.addBus(bus);
        return new ResponseEntity<>(savedBus, HttpStatus.CREATED);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Bus>> getAllBus(){
        List<Bus> busList= busService.getAllBuses();
        return new ResponseEntity<>(busList,HttpStatus.OK);
    }

    @DeleteMapping("/{busId}")
    public ResponseEntity<String> deleteBus(@PathVariable Long busId){
        busService.deleteBusById(busId);
        return new ResponseEntity<>("Bus deleted successfully", HttpStatus.OK);
    }

    @PutMapping(value = "/{busId}",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Bus> updateBus(@PathVariable Long busId, @RequestBody Bus bus){
        Bus updatedBus = busService.updateBus(busId, bus);
        return new ResponseEntity<>(updatedBus, HttpStatus.OK);
    }
}
