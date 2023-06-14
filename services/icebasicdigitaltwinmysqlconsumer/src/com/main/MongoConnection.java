
package com.main;

/**
 *
 * @author mitch
 */
public class MongoConnection {
    
    String username = "dashboard";
    String password = "4ddgDL7iEIdE";
    String connectionDatabase = "admin";
    String serverAddress = "icemain.hopto.org";
    int serverPort = 8054;

    public MongoConnection() {
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getConnectionDatabase() {
        return connectionDatabase;
    }

    public String getServerAddress() {
        return serverAddress;
    }

    public int getServerPort() {
        return serverPort;
    }
    
    
    
}
