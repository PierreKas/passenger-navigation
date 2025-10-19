package passenger.navigation.passenger_navigation_system.repository;

import passenger.navigation.passenger_navigation_system.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {

}
