package service;


import model.Destination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.DestinationRepository;


import java.util.List;
import java.util.Optional;

@Service
public class DestinationService {
    @Autowired
    public DestinationRepository destinationRepository;

    public Destination addDestination(Destination destination){
        return destinationRepository.save(destination);
    }

    public List<Destination> getAllDestionations(){
        return destinationRepository.findAll();
    }

    public void deleteDestinationById(Long destinationId){
        destinationRepository.deleteById(destinationId);
    }

    public Destination updateDestination(Long destinationId, Destination updatedData){
        Optional<Destination> existingDestination =destinationRepository.findById(destinationId);

        if (existingDestination.isPresent()){
            Destination destination=existingDestination.get();
            destination.setDestination(updatedData.getDestination());
            destination.setPrice(updatedData.getPrice());

            return destinationRepository.save(destination);
        }else {
            return null;
        }
    }
}
