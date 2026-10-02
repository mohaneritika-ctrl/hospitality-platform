package com.hospitality.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        String rawUrl = properties.getUrl();
        String username = properties.getUsername();
        String password = properties.getPassword();

        // Check common cloud environment variables (Render, Railway, Neon)
        String envDbUrl = System.getenv("DATABASE_URL");
        if (envDbUrl == null || envDbUrl.isBlank()) {
            envDbUrl = System.getenv("SPRING_DATASOURCE_URL");
        }
        if (envDbUrl == null || envDbUrl.isBlank()) {
            envDbUrl = System.getenv("DB_URL");
        }

        if (envDbUrl != null && !envDbUrl.isBlank()) {
            rawUrl = envDbUrl;
        }

        // If URL starts with postgres:// or postgresql:// (non-JDBC standard), convert it to valid JDBC format
        if (rawUrl != null && (rawUrl.startsWith("postgres://") || rawUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(rawUrl.replace("postgres://", "http://").replace("postgresql://", "http://"));
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath();
                String query = uri.getQuery();

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":", 2);
                    username = userInfo[0];
                    if (userInfo.length > 1) {
                        password = userInfo[1];
                    }
                }

                String jdbcUrl = "jdbc:postgresql://" + host + ":" + port + path;
                if (query != null && !query.isBlank()) {
                    jdbcUrl += "?" + query;
                } else {
                    jdbcUrl += "?sslmode=require";
                }

                rawUrl = jdbcUrl;
                logger.info("Parsed cloud PostgreSQL connection URL successfully for host: {}", host);
            } catch (Exception e) {
                logger.warn("Could not parse database URL as URI: {}, will attempt raw URL: {}", e.getMessage(), rawUrl);
            }
        }

        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = properties.determineUrl();
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(rawUrl);
        config.setUsername(username != null ? username : properties.determineUsername());
        config.setPassword(password != null ? password : properties.determinePassword());
        config.setDriverClassName(properties.determineDriverClassName());
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);

        return new HikariDataSource(config);
    }
}
