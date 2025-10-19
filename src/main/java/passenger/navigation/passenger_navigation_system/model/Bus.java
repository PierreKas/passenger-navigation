package passenger.navigation.passenger_navigation_system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "buses")
@Data
public class Bus {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "destination_id")
    private Destination destination;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "total_number_of_seats")
    private Integer totalNumberOfSeats;

    @Column(name = "number_of_available_seats")
    private Integer numberOfAvailableSeats;

    private String busStatus;

    @Column(name = "travel_date")
    private LocalDate travelDate;
}