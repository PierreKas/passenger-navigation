package service;

import model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    public UserRepository userRepository;

    public User addUuser(User user){
        return userRepository.save(user);
    }

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

    public void deleteUserById(Long userId){
        userRepository.deleteById(userId);
    }

    public User updateUser(Long userId, User updatedData){
         Optional<User> existingUser =userRepository.findById(userId);

         if (existingUser.isPresent()){
             User user=existingUser.get();
             user.setAddress(updatedData.getAddress());
             user.setRole(updatedData.getRole());
             user.setGender(updatedData.getGender());
             user.setFullName(updatedData.getFullName());
             return userRepository.save(user);
         }else {
             return null;
         }
    }
}
