package com.bookreview.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationInMs;

    private Key key() {
        try {
            return Keys.hmacShaKeyFor(jwtSecret.getBytes());
        } catch (Exception e) {
            logger.error("Error creating signing key", e);
            throw new RuntimeException("Error creating signing key", e);
        }
    }

    public String generateToken(Authentication authentication) {
        try {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            logger.debug("Generating JWT token for user: {}", userPrincipal.getEmail());

            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

            String token = Jwts.builder()
                    .setSubject(userPrincipal.getEmail())
                    .setIssuedAt(now)
                    .setExpiration(expiryDate)
                    .signWith(key())
                    .compact();
            
            logger.debug("Generated JWT token: {}", token);
            return token;
        } catch (Exception e) {
            logger.error("Error generating JWT token", e);
            throw new RuntimeException("Error generating JWT token", e);
        }
    }

    public String getEmailFromJWT(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String email = claims.getSubject();
            logger.debug("Extracted email from JWT: {}", email);
            return email;
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired", e);
            throw e;
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported", e);
            throw e;
        } catch (MalformedJwtException e) {
            logger.error("JWT token is malformed", e);
            throw e;
        } catch (SignatureException e) {
            logger.error("JWT signature validation failed", e);
            throw e;
        } catch (Exception e) {
            logger.error("Error extracting email from JWT", e);
            throw e;
        }
    }

    public boolean validateToken(String token) {
        try {
            logger.debug("Starting token validation for token: {}", token.substring(0, 20) + "...");
            Claims claims = Jwts.parserBuilder()
                .setSigningKey(key())
                .build()
                .parseClaimsJws(token)
                .getBody();
            
            String email = claims.getSubject();
            Date expiration = claims.getExpiration();
            Date now = new Date();
            
            logger.debug("Token validation details - Email: {}, Expiration: {}, Current time: {}", 
                email, expiration, now);
            
            if (expiration.before(now)) {
                logger.error("Token has expired. Expiration: {}, Current time: {}", expiration, now);
                return false;
            }
            
            logger.debug("JWT token is valid");
            return true;
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
            return false;
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
            return false;
        } catch (MalformedJwtException e) {
            logger.error("JWT token is malformed: {}", e.getMessage());
            return false;
        } catch (SignatureException e) {
            logger.error("JWT signature validation failed: {}", e.getMessage());
            return false;
        } catch (Exception e) {
            logger.error("Error validating JWT token: {}", e.getMessage(), e);
            return false;
        }
    }
} 