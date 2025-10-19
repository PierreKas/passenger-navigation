package passenger.navigation.passenger_navigation_system.controller;


import passenger.navigation.passenger_navigation_system.model.Destination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import passenger.navigation.passenger_navigation_system.service.DestinationService;

import java.util.List;
@RequestMapping("/api/destination")
@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT,RequestMethod.DELETE})
public class DestinationController {
    @Autowired
    private DestinationService destinationService;

    @PostMapping(value = "/add",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Destination> addDestination(@RequestBody Destination destination){
        Destination savedDestination= destinationService.addDestination(destination);
        return new ResponseEntity<>(savedDestination, HttpStatus.CREATED);
    }
    @GetMapping("/all")
    public ResponseEntity<List<Destination>> getAllDestination(){
        List<Destination> destinationList= destinationService.getAllDestionations();
        return new ResponseEntity<>(destinationList,HttpStatus.OK);
    }

    @DeleteMapping("/delete/{destinationId}")
    public ResponseEntity<String> deleteDestination(@PathVariable Long destinationId){
        destinationService.deleteDestinationById(destinationId);
        return new ResponseEntity<>("Destination deleted successfully", HttpStatus.OK);
    }

    @PutMapping(value = "/update/{destinationId}",consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Destination> updateDestination(@PathVariable Long destinationId, @RequestBody Destination destination){
        Destination updatedDestination = destinationService.updateDestination(destinationId, destination);
        return new ResponseEntity<>(updatedDestination, HttpStatus.OK);
    }
}
