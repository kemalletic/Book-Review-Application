package com.bookreview.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final CustomUserDetailsService customUserDetailsService;
    
    private static final List<String> PUBLIC_PATHS = Arrays.asList(
        "/api/auth/login",
        "/api/auth/register",
        "/api/books$",  // Only exact match for /api/books (list all books)
        "/v3/api-docs",
        "/swagger-ui",
        "/swagger-ui.html",
        "/favicon.ico",
        "/logo192.png",
        "/logo512.png",
        "/default-cover.png",
        "/uploads/covers"
    );

    public JwtAuthenticationFilter(JwtTokenProvider tokenProvider, CustomUserDetailsService customUserDetailsService) {
        this.tokenProvider = tokenProvider;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        try {
            String path = request.getRequestURI();
            
            // Skip JWT validation for public paths
            if (isPublicPath(path, request.getMethod())) {
                filterChain.doFilter(request, response);
                return;
            }

            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                String email = tokenProvider.getEmailFromJWT(jwt);
                
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
                
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            // Log error but continue without authentication
            System.err.println("JWT authentication error: " + ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    private boolean isPublicPath(String path, String method) {
        // Check exact matches and regex patterns
        for (String publicPath : PUBLIC_PATHS) {
            if (publicPath.endsWith("$")) {
                // Regex pattern
                if (path.matches(publicPath)) {
                    return true;
                }
            } else {
                // Simple startsWith check
                if (path.startsWith(publicPath)) {
                    return true;
                }
            }
        }
        
        // Specific book-related public paths (GET only)
        if (path.startsWith("/api/books/") && "GET".equals(method)) {
            // GET /api/books/{id} - view book details
            if (path.matches("/api/books/\\d+$")) {
                return true;
            }
            // GET /api/books/{id}/reviews - view reviews
            if (path.matches("/api/books/\\d+/reviews$")) {
                return true;
            }
        }
        
        // POST /api/books/{id}/reviews requires authentication
        if (path.matches("/api/books/\\d+/reviews$") && "POST".equals(method)) {
            return false;
        }
        
        return false;
    }
}