package dev.rodolfo.advo.dashboard.infrastructure.adapter.in.web;

import dev.rodolfo.advo.dashboard.application.dto.DashboardResponse;
import dev.rodolfo.advo.dashboard.application.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumo")
    @PreAuthorize("hasAnyRole('ADMIN', 'ADVOGADO')")
    public ResponseEntity<DashboardResponse> getResumo(@RequestParam Long usuarioId) {
        DashboardResponse response = dashboardService.obterResumoDashboard(usuarioId);
        return ResponseEntity.ok(response);
    }
}
