#include <algorithm>
#include <cmath>
#include <cstdio>

int main() {
    int m;
    std::scanf("%d", &m);
    while (m--) {
        double a[4][5];
        for (int i = 0; i < 4; ++i)
            for (int j = 0; j < 5; ++j) std::scanf("%lf", &a[i][j]);
        for (int k = 0; k < 4; ++k) {
            int pivot = k;
            for (int i = k + 1; i < 4; ++i)
                if (std::fabs(a[i][k]) > std::fabs(a[pivot][k])) pivot = i;
            for (int j = 0; j < 5; ++j) std::swap(a[k][j], a[pivot][j]);
            double divisor = a[k][k];
            for (int j = k; j < 5; ++j) a[k][j] /= divisor;
            for (int i = 0; i < 4; ++i) {
                if (i == k) continue;
                double factor = a[i][k];
                for (int j = k; j < 5; ++j) a[i][j] -= factor * a[k][j];
            }
        }
        std::printf("%.9f %.9f %.9f %.9f\n", a[0][4], a[1][4], a[2][4], a[3][4]);
    }
    return 0;
}
