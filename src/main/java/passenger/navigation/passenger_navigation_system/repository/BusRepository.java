package passenger.navigation.passenger_navigation_system.repository;

import passenger.navigation.passenger_navigation_system.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusRepository extends JpaRepository<Bus,Long> {

}
